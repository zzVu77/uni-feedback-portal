import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique ID of the user',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  fullName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: UserRole.STUDENT,
    enum: UserRole,
    description: 'Role of the user',
  })
  role: UserRole;

  @ApiProperty({
    description: 'Department the user belongs to, optional',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Information Technology Department',
      email: 'it@example.com',
      location: 'Main Building',
    },
    required: false,
  })
  department?: {
    id: string;
    name: string;
    email?: string;
    location?: string | null;
  };

  @ApiProperty({
    example: '2025-10-15T10:00:00Z',
    description: 'Date when the user was created',
  })
  createdAt: string;
}
