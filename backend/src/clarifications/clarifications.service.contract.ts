import { CreateClarificationDto } from './dto/create-clarification.dto';
import { QueryClarificationsDto } from './dto/query-clarifications.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { CloseClarificationDto } from './dto/close-clarification.dto';

export interface ClarificationsServiceContract {
  open(
    dto: CreateClarificationDto,
    actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  ): Promise<{
    conversation_id: number;
    feedback_id: number;
    is_closed: false;
    created_at: string;
  }>;
  list(
    query: QueryClarificationsDto,
    actor: {
      user_id: number;
      role: 'Student' | 'DepartmentStaff' | 'Admin';
      department_id: number;
    },
  ): Promise<{
    items: Array<{
      conversation_id: number;
      feedback_id: number;
      is_closed: boolean;
      created_at: string;
    }>;
    total: number;
  }>;
  get(
    conversation_id: number,
    actor: { user_id: number; role: 'Student' | 'DepartmentStaff' | 'Admin' },
  ): Promise<{
    conversation_id: number;
    feedback_id: number;
    is_closed: boolean;
    created_at: string;
    messages: Array<{
      message_id: number;
      user_id: number;
      content: string;
      created_at: string;
    }>;
  }>;
  postMessage(
    dto: CreateMessageDto,
    actor: { user_id: number },
  ): Promise<{
    message_id: number;
    conversation_id: number;
    user_id: number;
    content: string;
    created_at: string;
  }>;
  close(
    conversation_id: number,
    dto: CloseClarificationDto,
    actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  ): Promise<{
    conversation_id: number;
    is_closed: boolean;
    updated_at: string;
  }>;
}
