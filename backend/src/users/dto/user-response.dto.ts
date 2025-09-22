import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'Unique user identifier' })
  user_id: number;

  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Full name of the user',
    nullable: true,
  })
  full_name: string | null;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    enum: ['Student', 'DepartmentStaff', 'Admin'],
    description: 'Role of the user in the system',
    example: 'Student',
  })
  role: 'Student' | 'DepartmentStaff' | 'Admin';

  @ApiProperty({
    example: 2,
    description: 'Department ID where the user belongs',
  })
  department_id: number;

  @ApiProperty({
    example: '2025-09-22T12:34:56.000Z',
    description: 'Timestamp when the user was created',
  })
  created_at: string;
}
