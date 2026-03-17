import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateClarificationDto {
  @ApiProperty({
    description: 'The ID of the feedback this conversation is related to.',
    example: '550e8400-e29b-41d4-a716-446655440013',
  })
  @IsUUID('loose')
  feedbackId: string;

  @ApiProperty({
    description: 'The subject or title of the clarification conversation.',
    example: 'Need more details on the projector issue',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  subject: string;

  @ApiPropertyOptional({
    description: 'The initial message to start the conversation.',
    example: 'Could you please specify which projector is malfunctioning?',
  })
  @IsOptional()
  @IsString()
  initialMessage?: string;
}
