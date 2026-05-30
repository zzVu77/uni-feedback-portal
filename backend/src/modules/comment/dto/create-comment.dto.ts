import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This post is really helpful!',
  })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({
    description: 'Parent comment ID (if this is a reply)',
    example: '550e8400-e29b-41d4-a716-446655440034',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('loose')
  parentId?: string | null;
}
