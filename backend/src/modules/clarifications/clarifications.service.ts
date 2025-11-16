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
import { Prisma, UserRole } from '@prisma/client';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Injectable()
export class ClarificationsService {
  constructor(private readonly prisma: PrismaService) {}

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
    const feedback = await this.prisma.feedbacks.findUnique({
      where: { id: feedbackId },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${feedbackId} not found.`);
    }

    const conversation = await this.prisma.$transaction(async (tx) => {
      const newConversation = await tx.clarificationConversations.create({
        data: {
          subject,
          feedbackId,
          userId: actor.sub,
        },
      });

      const messages = [];
      if (initialMessage) {
        const newMessage = await tx.messages.create({
          data: {
            conversationId: newConversation.id,
            userId: actor.sub,
            content: initialMessage,
          },
          include: {
            user: { select: { id: true, fullName: true, role: true } },
            attachments: true,
          },
        });
        messages.push(newMessage);
      }

      return { ...newConversation, messages };
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
        attachments: msg.attachments,
      })),
    };
  }

  async getAllClarificationsConversations(
    query: QueryClarificationsDto,
    actor: ActiveUserData,
  ): Promise<ClarificationListResponseDto> {
    const { page = 1, pageSize = 10, feedbackId, isClosed } = query;

    const where: Prisma.ClarificationConversationsWhereInput = {
      OR: [{ userId: actor.sub }, { feedback: { userId: actor.sub } }],
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

  async getClarificationConversationDetail(
    conversationId: string,
    actor: ActiveUserData,
  ): Promise<ClarificationDetailDto> {
    const conversation =
      await this.prisma.clarificationConversations.findUnique({
        where: { id: conversationId },
        include: {
          feedback: { select: { userId: true } },
          messages: {
            include: {
              user: { select: { id: true, fullName: true, role: true } },
              attachments: true,
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
        attachments: msg.attachments,
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
      conversation.userId !== actor.sub &&
      conversation.feedback.userId !== actor.sub
    ) {
      throw new ForbiddenException(
        'You are not authorized to post in this conversation.',
      );
    }

    const message = await this.prisma.messages.create({
      data: {
        conversationId,
        userId: actor.sub,
        content,
        ...(attachments && {
          attachments: {
            create: attachments.map((file) => ({
              fileName: file.fileName,
              fileUrl: file.fileUrl,
            })),
          },
        }),
      },
      include: {
        user: { select: { id: true, fullName: true, role: true } },
        attachments: true,
      },
    });

    return {
      id: message.id,
      content: message.content ?? 'Message not found',
      createdAt: message.createdAt.toISOString(),
      user: message.user,
      attachments: message.attachments,
    };
  }

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
              attachments: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

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
        attachments: msg.attachments,
      })),
    };
  }
}
