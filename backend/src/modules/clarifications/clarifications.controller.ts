import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ClarificationsService } from './clarifications.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
@ApiTags('Clarifications')
@Controller('clarifications')
export class ClarificationsController {
  constructor(private readonly clarificationsService: ClarificationsService) {}
  // Dummy user ID for demonstration purposes
  // private readonly userId = '550e8400-e29b-41d4-a716-446655440009';
  private readonly userId = '550e8400-e29b-41d4-a716-44665544000b';
  private readonly staffId = '550e8400-e29b-41d4-a716-44665544000f';
  @Post()
  @ApiOperation({
    summary: 'Create a new clarification conversation',
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
  CreateClarificationConversation(
    @Body() createClarificationDto: CreateClarificationDto,
  ) {
    // Assuming the service method needs the user ID of the creator
    return this.clarificationsService.CreateClarificationConversation(
      createClarificationDto,
      this.staffId,
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
  GetAllClarificationsConversations(@Query() query: QueryClarificationsDto) {
    return this.clarificationsService.GetAllClarificationsConversations(
      query,
      this.staffId,
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
  GetClarificationConversationDetail(@Param() params: ClarificationParamDto) {
    return this.clarificationsService.GetClarificationConversationDetail(
      params.conversationId,
      this.staffId,
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
  CreateMessage(
    @Param() params: ClarificationParamDto,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.clarificationsService.CreateMessage(
      params.conversationId,
      createMessageDto,
      this.userId,
    );
  }

  @Patch(':conversationId')
  @ApiOperation({
    summary: 'Close a conversation',
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
  CloseClarificationConversation(
    @Param() params: ClarificationParamDto,
    @Body() closeClarificationDto: CloseClarificationDto,
  ) {
    return this.clarificationsService.CloseClarificationConversation(
      params.conversationId,
      closeClarificationDto,
      this.staffId,
    );
  }
}
