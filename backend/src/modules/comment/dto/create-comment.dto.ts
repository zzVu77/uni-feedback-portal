import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This post is really helpful!',
  })
  @IsString()
  @MinLength(1)
  content: string;
}
