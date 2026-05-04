import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FeedbackStatus } from '@prisma/client';

export class BulkUpdateFeedbackStatusDto {
  @ApiProperty({
    type: [String],
    description: 'Feedback IDs to update (same rules as single status update)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  feedbackIds: string[];

  @ApiProperty({
    enum: FeedbackStatus,
    example: FeedbackStatus.RESOLVED,
  })
  @IsEnum(FeedbackStatus)
  status: FeedbackStatus;

  @ApiPropertyOptional({
    description: 'Optional note applied to each feedback status history entry',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
