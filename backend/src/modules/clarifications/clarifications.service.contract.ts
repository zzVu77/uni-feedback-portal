import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
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
  createClarificationConversation(
    dto: CreateClarificationDto,
    actor: ActiveUserData,
  ): Promise<ClarificationDetailDto>;
  getAllClarificationsConversations(
    query: QueryClarificationsDto,
    actor: ActiveUserData,
  ): Promise<ClarificationListResponseDto>;
  getClarificationConversationDetail(
    conversationId: string,
    actor: ActiveUserData,
  ): Promise<ClarificationDetailDto>;
  createMessage(
    conversationId: string,
    dto: CreateMessageDto,
    actor: ActiveUserData,
  ): Promise<MessageDto>;
  closeClarificationConversation(
    conversationId: string,
    dto: CloseClarificationDto,
    actor: ActiveUserData,
  ): Promise<ClarificationDetailDto>;
}
