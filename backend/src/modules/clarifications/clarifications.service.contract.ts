import {
  CloseClarificationDto,
  CreateClarificationDto,
  CreateMessageDto,
  QueryClarificationsDto,
  ClarificationDetailDto,
  ClarificationListResponseDto,
  MessageDto,
} from './dto/';

export interface ClarificationsServiceContract {
  CreateClarificationConversation(
    dto: CreateClarificationDto,
    userId: string,
  ): Promise<ClarificationDetailDto>;
  GetAllClarificationsConversations(
    query: QueryClarificationsDto,
    userId: string,
  ): Promise<ClarificationListResponseDto>;
  GetClarificationConversationDetail(
    conversationId: string,
    userId: string,
  ): Promise<ClarificationDetailDto>;
  CreateMessage(dto: CreateMessageDto, userId: string): Promise<MessageDto>;
  CloseClarification(
    conversationId: string,
    dto: CloseClarificationDto,
    userId: string,
  ): Promise<ClarificationDetailDto>;
}
