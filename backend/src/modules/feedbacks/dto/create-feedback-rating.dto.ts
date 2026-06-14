import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackRatingDto {
  @ApiProperty({ example: 5, description: 'Rating score from 1 to 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  ratingScore: number;

  @ApiPropertyOptional({ example: 'Very helpful and fast response' })
  @IsString()
  @IsOptional()
  comment?: string;
}
