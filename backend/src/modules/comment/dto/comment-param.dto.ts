import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CommentParamDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440034',
    description: 'Unique ID of the comment',
  })
  @IsString()
  commentId: string;
}
