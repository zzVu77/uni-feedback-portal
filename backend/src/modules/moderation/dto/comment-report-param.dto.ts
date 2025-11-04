import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CommentReportParamDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-44665544003b',
    description: 'Unique ID of the comment report',
  })
  @IsString()
  commentReportId: string;
}
