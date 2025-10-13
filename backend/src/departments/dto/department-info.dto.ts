import { ApiProperty } from '@nestjs/swagger';

export class DepartmentResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the department',
    example: 1,
    nullable: false,
  })
  departmentId: number;

  @ApiProperty({
    description: 'Name of the department',
    example: 'Khoa Công nghệ thông tin',
    nullable: false,
  })
  departmentName: string;
}
