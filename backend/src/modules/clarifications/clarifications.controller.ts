import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ClarificationsService } from './clarifications.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateClarificationDto,
  QueryClarificationsDto,
  ClarificationParamDto,
  CreateMessageDto,
  CloseClarificationDto,
  ClarificationDetailDto,
  ClarificationListResponseDto,
  MessageDto,
} from './dto/';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
@ApiTags('Clarifications')
@ApiBearerAuth()
@Controller('clarifications')
export class ClarificationsController {
  constructor(private readonly clarificationsService: ClarificationsService) {}
  // Dummy user ID for demonstration purposes
  // private readonly userId = '550e8400-e29b-41d4-a716-446655440009';
  // private readonly userId = '550e8400-e29b-41d4-a716-446655440009';
  // private readonly staffId = '550e8400-e29b-41d4-a716-44665544000f';

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({
    summary: 'Create a new clarification conversation (Staff only)',
    description:
      'Starts a new conversation thread related to a specific feedback item.',
  })
  @ApiBody({ type: CreateClarificationDto })
  @ApiResponse({
    status: 201,
    description: 'The conversation has been successfully created.',
    type: ClarificationDetailDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Feedback not found.' })
  createClarificationConversation(
    @Body() createClarificationDto: CreateClarificationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.clarificationsService.createClarificationConversation(
      createClarificationDto,
      user,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get a list of clarification conversations',
    description:
      'Retrieves a paginated list of conversations, with optional filters for feedback ID and closed status.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of conversations.',
    type: ClarificationListResponseDto,
  })
  getAllClarificationsConversations(
    @Query() query: QueryClarificationsDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.clarificationsService.getAllClarificationsConversations(
      query,
      user,
    );
  }

  @Get(':conversationId')
  @ApiOperation({
    summary: 'Get conversation details',
    description:
      'Retrieves the full details of a single clarification conversation, including all its messages.',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation details retrieved successfully.',
    type: ClarificationDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Conversation not found.' })
  getClarificationConversationDetail(
    @Param() params: ClarificationParamDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.clarificationsService.getClarificationConversationDetail(
      params.conversationId,
      user,
    );
  }

  @Post(':conversationId/messages')
  @ApiOperation({
    summary: 'Send a message in a conversation',
    description:
      'Adds a new message to an existing clarification conversation. The user must be a participant.',
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully sent.',
    type: MessageDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Conversation is closed.',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found.' })
  createMessage(
    @Param() params: ClarificationParamDto,
    @Body() createMessageDto: CreateMessageDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.clarificationsService.createMessage(
      params.conversationId,
      createMessageDto,
      user,
    );
  }

  @Patch(':conversationId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DEPARTMENT_STAFF)
  @ApiOperation({
    summary: 'Close a conversation (Staff only)',
    description:
      'Marks a clarification conversation as closed. Only the user who started the conversation can close it.',
  })
  @ApiBody({ type: CloseClarificationDto })
  @ApiResponse({
    status: 200,
    description: 'The conversation has been successfully closed.',
    type: ClarificationDetailDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Conversation not found.' })
  closeClarificationConversation(
    @Param() params: ClarificationParamDto,
    @Body() closeClarificationDto: CloseClarificationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.clarificationsService.closeClarificationConversation(
      params.conversationId,
      closeClarificationDto,
      user,
    );
  }
}
