import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '1', description: 'Unique user identifier' })
  id: string;

  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Full name of the user',
    nullable: true,
  })
  fullName: string | null;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    enum: ['STUDENT', 'DEPARTMENT_STAFF', 'ADMIN'],
    description: 'Role of the user in the system',
    example: 'STUDENT',
  })
  role: 'STUDENT' | 'DEPARTMENT_STAFF' | 'ADMIN';

  @ApiProperty({
    example: '2',
    description: 'Department ID where the user belongs',
  })
  departmentId: string;

  @ApiProperty({
    example: '2025-09-22T12:34:56.000Z',
    description: 'Timestamp when the user was created',
  })
  createdAt: string;
}
