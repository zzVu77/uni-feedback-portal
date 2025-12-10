import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { FileAttachmentDto } from 'src/modules/uploads/dto';
// --- Reusable Sub-DTOs ---

class MessageAuthorDto {
  @ApiProperty({
    description: "The author's unique ID.",
    example: '550e8400-e29b-41d4-a716-446655440009',
  })
  id: string;

  @ApiProperty({ description: "The author's full name.", example: 'John Doe' })
  fullName: string;

  @ApiProperty({
    description: "The author's role.",
    enum: UserRole,
    example: UserRole.DEPARTMENT_STAFF,
  })
  role: UserRole;
}

// class ClarificationAuthorDto {
//   @ApiProperty({
//     description: "The author's unique ID.",
//     example: '550e8400-e29b-41d4-a716-446655440009',
//   })
//   id: string;

//   @ApiProperty({ description: "The author's full name.", example: 'John Doe' })
//   fullName: string;
// }

// class ClarificationFeedbackDto {
//   @ApiProperty({
//     description: 'The unique ID of the related feedback.',
//     example: '550e8400-e29b-41d4-a716-446655440013',
//   })
//   id: string;

//   @ApiProperty({
//     description: 'The subject of the related feedback.',
//     example: 'Projector in Room 201 is not working',
//   })
//   subject: string;
// }

// --- Main Response DTOs ---

export class MessageDto {
  @ApiProperty({
    description: 'The unique ID of the message.',
    example: '550e8400-e29b-41d4-a716-446655440042',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'The text content of the message.',
    example: 'Could you please provide the error code?',
  })
  content?: string | null;

  @ApiProperty({
    description: 'The timestamp when the message was created.',
    example: '2025-09-02T10:15:00.000Z',
  })
  createdAt: string;

  @ApiProperty({ type: MessageAuthorDto })
  user: MessageAuthorDto;

  @ApiProperty({ type: [FileAttachmentDto] })
  attachments: FileAttachmentDto[];
}

export class ClarificationListItemDto {
  @ApiProperty({
    description: 'The unique ID of the conversation.',
    example: '550e8400-e29b-41d4-a716-44665544003e',
  })
  id: string;

  @ApiProperty({
    description: 'The subject of the conversation.',
    example: 'Clarification on Course Registration Issue',
  })
  subject: string;

  @ApiProperty({
    description: 'Indicates if the conversation is closed.',
    example: false,
  })
  isClosed: boolean;

  @ApiProperty({
    description: 'The timestamp when the conversation was created.',
    example: '2025-09-02T10:10:00.000Z',
  })
  createdAt: string;

  //   @ApiProperty({ type: ClarificationAuthorDto })
  //   user: ClarificationAuthorDto;

  //   @ApiProperty({ type: ClarificationFeedbackDto })
  //   feedback: ClarificationFeedbackDto;
}

export class ClarificationListResponseDto {
  @ApiProperty({ type: [ClarificationListItemDto] })
  @Type(() => ClarificationListItemDto)
  results: ClarificationListItemDto[];

  @ApiProperty({ description: 'Total number of items.', example: 25 })
  total: number;
}

export class ClarificationDetailDto {
  @ApiProperty({
    description: 'The unique ID of the conversation.',
    example: '550e8400-e29b-41d4-a716-44665544003e',
  })
  id: string;

  @ApiProperty({
    description: 'The subject of the conversation.',
    example: 'Clarification on Course Registration Issue',
  })
  subject: string;

  @ApiProperty({
    description: 'Indicates if the conversation is closed.',
    example: false,
  })
  isClosed: boolean;

  @ApiProperty({
    description: 'The timestamp when the conversation was created.',
    example: '2025-09-02T10:10:00.000Z',
  })
  createdAt: string;

  //   @ApiProperty({ type: ClarificationAuthorDto })
  //   user: ClarificationAuthorDto;

  //   @ApiProperty({ type: ClarificationFeedbackDto })
  //   feedback: ClarificationFeedbackDto;

  @ApiProperty({
    description: 'A list of all messages in the conversation.',
    type: [MessageDto],
  })
  @Type(() => MessageDto)
  messages: MessageDto[];
}
