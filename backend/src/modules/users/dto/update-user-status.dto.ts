import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ enum: UserStatus, example: UserStatus.DEACTIVATED })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiPropertyOptional({
    example: 7,
    description: 'Duration in days to deactivate the account',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  durationDays?: number;

  // @ApiPropertyOptional({ example: 'password123', description: 'Update password if provided' })
  // @IsString()
  // @IsOptional()
  // password?: string;

  // @ApiPropertyOptional({ example: 'New Name', description: 'Update full name if provided' })
  // @IsString()
  // @IsOptional()
  // fullName?: string;
}
