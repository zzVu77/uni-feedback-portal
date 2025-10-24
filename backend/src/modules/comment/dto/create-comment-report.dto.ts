import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentReportDto {
  @ApiProperty({
    description: 'Optional reason why the comment is being reported',
    example: 'Contains offensive language',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
