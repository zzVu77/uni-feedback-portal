import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateCategoryStatusDto {
  @ApiProperty({
    description: 'The new active status for the category.',
    example: false,
  })
  @IsBoolean()
  isActive: boolean;
}
