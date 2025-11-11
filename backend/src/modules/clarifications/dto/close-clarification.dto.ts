import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CloseClarificationDto {
  @ApiProperty({
    description: 'Must be true to close the conversation.',
    example: true,
  })
  @IsBoolean()
  isClosed: boolean;

  @ApiPropertyOptional({
    description: 'An optional closing message.',
    example: 'The issue has been clarified. Closing this conversation.',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
