import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The new full name of the user',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  fullName?: string;
}
