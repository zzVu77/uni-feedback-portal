import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DepartmentParamDto {
  @ApiProperty({
    description: 'The UUID of the department.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  // Commented out to allow flexibility in parameter types
  // @IsUUID()
  @IsString()
  departmentId: string;
}
