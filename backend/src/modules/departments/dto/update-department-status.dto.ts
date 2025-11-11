import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateDepartmentStatusDto {
  @ApiProperty({
    description: 'The new active status for the department.',
    example: false,
  })
  @IsBoolean()
  isActive: boolean;
}
