import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class FeedbackParamDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440018',
    description: 'Unique ID of the feedback to retrieve details for',
  })
  @IsUUID('loose')
  feedbackId: string;
}
