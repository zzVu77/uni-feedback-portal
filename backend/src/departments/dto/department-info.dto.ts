import { ApiProperty } from '@nestjs/swagger';

export class DepartmentResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the department',
    example: 1,
    nullable: false,
  })
  department_id: number;

  @ApiProperty({
    description: 'Name of the department',
    example: 'Khoa Công nghệ thông tin',
    nullable: false,
  })
  department_name: string;
}
