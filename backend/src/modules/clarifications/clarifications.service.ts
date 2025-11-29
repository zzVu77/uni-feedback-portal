import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter'; // [Import 1]
import {
  CloseClarificationDto,
  CreateClarificationDto,
  CreateMessageDto,
  QueryClarificationsDto,
  ClarificationDetailDto,
  ClarificationListResponseDto,
  MessageDto,
} from './dto';
import { FileTargetType, Prisma, UserRole } from '@prisma/client';
import { UploadsService } from '../uploads/uploads.service';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
// [Import 2] Import Events
import { ClarificationCreatedEvent } from './events/clarification-created.event';
import { ClarificationMessageSentEvent } from './events/clarification-message-sent.event';

@Injectable()
export class ClarificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
    private readonly eventEmitter: EventEmitter2, // [Injection]
  ) {}

  async createClarificationConversation(
    dto: CreateClarificationDto,
    actor: ActiveUserData,
  ): Promise<ClarificationDetailDto> {
    const { feedbackId, subject, initialMessage } = dto;

    if (actor.role !== UserRole.DEPARTMENT_STAFF) {
      throw new ForbiddenException(
        `Only department staff can start a clarification conversation.`,
      );
    }
    // Need to fetch feedback to get the Student ID
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId, departmentId: actor.departmentId },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }

    const conversation = await this.prisma.clarificationConversations.create({
      data: {
        subject,
        feedbackId,
        userId: actor.sub, // Staff ID
        messages: {
          create: initialMessage
            ? {
                userId: actor.sub,
                content: initialMessage,
              }
            : undefined,
        },
      },
      include: {
        messages: {
          include: {
            user: { select: { id: true, fullName: true, role: true } },
          },
        },
      },
    });

    // [New Logic] Emit Event: Conversation Created
    // Notify the student that a clarification request has been started
    const event = new ClarificationCreatedEvent({
      conversationId: conversation.id,
      studentId: feedback.userId, // Send to Student
      subject: conversation.subject,
      feedbackId: feedback.id,
    });
    this.eventEmitter.emit('clarification.created', event);

    return {
      id: conversation.id,
      subject: conversation.subject,
      isClosed: conversation.isClosed,
      createdAt: conversation.createdAt.toISOString(),
      messages: conversation.messages.map((msg) => ({
        id: msg.id,
        content: msg.content ?? 'Message not found',
        createdAt: msg.createdAt.toISOString(),
        user: msg.user,
        attachments: [],
      })),
    };
  }

  // ... (Keep getAllClarificationsConversations and getClarificationConversationDetail as is)
  async getAllClarificationsConversations(
    query: QueryClarificationsDto,
    actor: ActiveUserData,
  ): Promise<ClarificationListResponseDto> {
    const { page = 1, pageSize = 10, feedbackId, isClosed } = query;

    const where: Prisma.ClarificationConversationsWhereInput = {
      OR: [{ userId: actor.sub }, { feedback: { userId: actor.sub } }],
      ...(feedbackId && { feedbackId }),
      ...(isClosed !== undefined && { isClosed: isClosed === 'true' }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.clarificationConversations.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.clarificationConversations.count({ where }),
    ]);

    return {
      results: items.map((item) => ({
        id: item.id,
        subject: item.subject,
        isClosed: item.isClosed,
        createdAt: item.createdAt.toISOString(),
      })),
      total,
    };
  }

  async getClarificationConversationDetail(
    conversationId: string,
    actor: ActiveUserData,
  ): Promise<ClarificationDetailDto> {
    const conversation =
      await this.prisma.clarificationConversations.findUnique({
        where: { id: conversationId },
        include: {
          feedback: { select: { userId: true, isPrivate: true } },
          messages: {
            include: {
              user: { select: { id: true, fullName: true, role: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found.`,
      );
    }

    if (
      conversation.userId !== actor.sub &&
      conversation.feedback.userId !== actor.sub
    ) {
      throw new ForbiddenException(
        'You are not authorized to view this conversation.',
      );
    }

    const messageIds = conversation.messages.map((msg) => msg.id);
    const attachmentsMap =
      await this.uploadsService.getAttachmentsForManyTargets(
        messageIds,
        FileTargetType.MESSAGE,
      );

    return {
      id: conversation.id,
      subject: conversation.subject,
      isClosed: conversation.isClosed,
      createdAt: conversation.createdAt.toISOString(),
      messages: conversation.messages.map((msg) => ({
        id: msg.id,
        content: msg.content ?? 'Message not found',
        createdAt: msg.createdAt.toISOString(),
        user:
          conversation.feedback.isPrivate &&
          msg.user.id === conversation.feedback.userId
            ? { ...msg.user, fullName: 'Anonymous' }
            : msg.user,
        attachments: attachmentsMap[msg.id] || [],
      })),
    };
  }

  async createMessage(
    conversationId: string,
    dto: CreateMessageDto,
    actor: ActiveUserData,
  ): Promise<MessageDto> {
    const { content, attachments } = dto;

    if (!content && (!attachments || attachments.length === 0)) {
      throw new ForbiddenException('Message must have content or attachments.');
    }

    // Need both conversation.userId (Staff) and feedback.userId (Student)
    const conversation =
      await this.prisma.clarificationConversations.findUnique({
        where: { id: conversationId },
        include: {
          feedback: { select: { userId: true } },
          // Ensure we select userId of the conversation creator (Staff)
        },
      });

    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found.`,
      );
    }

    if (conversation.isClosed) {
      throw new ForbiddenException('This conversation is closed.');
    }

    const staffId = conversation.userId; // The staff who started the chat
    const studentId = conversation.feedback.userId; // The student owner

    // Validate permission and determine recipient
    let recipientId: string;

    if (actor.sub === staffId) {
      // Sender is Staff -> Recipient is Student
      recipientId = studentId;
    } else if (actor.sub === studentId) {
      // Sender is Student -> Recipient is Staff
      recipientId = staffId;
    } else {
      throw new ForbiddenException(
        'You are not authorized to post in this conversation.',
      );
    }

    const message = await this.prisma.messages.create({
      data: {
        conversationId,
        userId: actor.sub,
        content,
      },
      include: {
        user: { select: { id: true, fullName: true, role: true } },
      },
    });

    if (attachments && attachments.length > 0) {
      await this.uploadsService.updateAttachmentsForTarget(
        message.id,
        FileTargetType.MESSAGE,
        attachments,
      );
    }

    // [New Logic] Emit Event: Message Sent
    const event = new ClarificationMessageSentEvent({
      conversationId: conversationId,
      senderId: actor.sub,
      recipientId: recipientId, // Logic determined above
      content: content ? content : 'Sent an attachment',
      feedbackId: conversation.feedbackId,
    });
    this.eventEmitter.emit('clarification.message_sent', event);

    const messageAttachments =
      await this.uploadsService.getAttachmentsForTarget(
        message.id,
        FileTargetType.MESSAGE,
      );

    return {
      id: message.id,
      content: message.content ?? 'Message not found',
      createdAt: message.createdAt.toISOString(),
      user: message.user,
      attachments: messageAttachments,
    };
  }

  // ... (Keep closeClarificationConversation as is)
  async closeClarificationConversation(
    conversationId: string,
    dto: CloseClarificationDto,
    actor: ActiveUserData,
  ): Promise<ClarificationDetailDto> {
    const conversation =
      await this.prisma.clarificationConversations.findUnique({
        where: { id: conversationId },
      });

    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found.`,
      );
    }

    if (conversation.userId !== actor.sub) {
      throw new ForbiddenException(
        'Only the initiator can close this conversation.',
      );
    }

    // use transaction to ensure atomicity
    const updatedConversation = await this.prisma.$transaction(async (tx) => {
      // 1. if there's a message, create it first
      if (dto.message) {
        await tx.messages.create({
          data: {
            conversationId: conversationId,
            userId: actor.sub,
            content: dto.message,
          },
        });
      }

      // 2.then update the conversation to closed
      return await tx.clarificationConversations.update({
        where: { id: conversationId },
        data: {
          isClosed: dto.isClosed,
        },
        include: {
          messages: {
            include: {
              user: { select: { id: true, fullName: true, role: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    });

    const messageIds = updatedConversation.messages.map((msg) => msg.id);
    const attachmentsMap =
      await this.uploadsService.getAttachmentsForManyTargets(
        messageIds,
        FileTargetType.MESSAGE,
      );

    return {
      id: updatedConversation.id,
      subject: updatedConversation.subject,
      isClosed: updatedConversation.isClosed,
      createdAt: updatedConversation.createdAt.toISOString(),
      messages: updatedConversation.messages.map((msg) => ({
        id: msg.id,
        content: msg.content ?? 'Message not found',
        createdAt: msg.createdAt.toISOString(),
        user: msg.user,
        attachments: attachmentsMap[msg.id] || [],
      })),
    };
  }
}
