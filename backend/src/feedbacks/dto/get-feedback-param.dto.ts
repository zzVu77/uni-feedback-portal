import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class GetFeedbackParamDto {
  @ApiProperty({
    example: 123,
    description: 'Unique ID of the feedback to retrieve details for',
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  feedbackId: number;
}
