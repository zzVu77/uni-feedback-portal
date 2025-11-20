import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
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

@Injectable()
export class ClarificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  async CreateClarificationConversation(
    dto: CreateClarificationDto,
    userId: string,
  ): Promise<ClarificationDetailDto> {
    const { feedbackId, subject, initialMessage } = dto;
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    if (user.role !== UserRole.DEPARTMENT_STAFF) {
      throw new ForbiddenException(
        `Only department staff can start a clarification conversation.`,
      );
    }
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }

    const conversation = await this.prisma.clarificationConversations.create({
      data: {
        subject,
        feedbackId,
        userId,
        messages: {
          create: initialMessage
            ? {
                userId,
                content: initialMessage,
                // Không xử lý attachments ở đây nữa
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
        attachments: [], // Tin nhắn ban đầu không có file
      })),
    };
  }

  async GetAllClarificationsConversations(
    query: QueryClarificationsDto,
    userId: string,
  ): Promise<ClarificationListResponseDto> {
    const { page = 1, pageSize = 10, feedbackId, isClosed } = query;

    const where: Prisma.ClarificationConversationsWhereInput = {
      OR: [{ userId }, { feedback: { userId } }],
      ...(feedbackId && { feedbackId }),
      ...(isClosed && { isClosed: isClosed === 'true' }),
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

  async GetClarificationConversationDetail(
    conversationId: string,
    userId: string,
  ): Promise<ClarificationDetailDto> {
    const conversation =
      await this.prisma.clarificationConversations.findUnique({
        where: { id: conversationId },
        include: {
          feedback: { select: { userId: true } },
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
      conversation.userId !== userId &&
      conversation.feedback.userId !== userId
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
        user: msg.user,
        attachments: attachmentsMap[msg.id] || [],
      })),
    };
  }

  async CreateMessage(
    conversationId: string,
    dto: CreateMessageDto,
    userId: string,
  ): Promise<MessageDto> {
    const { content, attachments } = dto;

    if (!content && (!attachments || attachments.length === 0)) {
      throw new ForbiddenException('Message must have content or attachments.');
    }

    const conversation =
      await this.prisma.clarificationConversations.findUnique({
        where: { id: conversationId },
        include: { feedback: { select: { userId: true } } },
      });

    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found.`,
      );
    }

    if (conversation.isClosed) {
      throw new ForbiddenException('This conversation is closed.');
    }

    if (
      conversation.userId !== userId &&
      conversation.feedback.userId !== userId
    ) {
      throw new ForbiddenException(
        'You are not authorized to post in this conversation.',
      );
    }

    const message = await this.prisma.messages.create({
      data: {
        conversationId,
        userId,
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

  async CloseClarificationConversation(
    conversationId: string,
    dto: CloseClarificationDto,
    userId: string,
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

    if (conversation.userId !== userId) {
      throw new ForbiddenException(
        'Only the initiator can close this conversation.',
      );
    }

    const updatedConversation =
      await this.prisma.clarificationConversations.update({
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
