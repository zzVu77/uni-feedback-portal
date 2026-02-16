import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostParamDto {
  @IsUUID('loose')
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-44665544002e',
    description: 'Post ID',
  })
  id: string;
}
