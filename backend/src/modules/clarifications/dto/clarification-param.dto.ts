import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClarificationParamDto {
  @ApiProperty({
    description: 'The ID of the clarification conversation.',
    example: '550e8400-e29b-41d4-a716-44665544003e',
  })
  @IsString()
  conversationId: string;
}
