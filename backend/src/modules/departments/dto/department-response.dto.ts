import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DepartmentDto {
  @ApiProperty({
    description: 'The unique UUID of the department.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the department.',
    example: 'IT Department',
  })
  name: string;

  @ApiProperty({
    description: 'The contact email for the department.',
    example: 'it.support@university.edu',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'A brief description of the department.',
    example:
      'Handles all technical infrastructure, network, and software support.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The physical location of the department office.',
    example: 'Building A, Room 101',
  })
  location?: string;

  @ApiPropertyOptional({
    description: 'The contact phone number for the department.',
    example: '123-456-7890',
  })
  phone?: string;

  @ApiProperty({
    description: 'Indicates if the department is active.',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The timestamp when the department was created.',
    example: '2025-09-01T09:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The number of feedbacks associated with this department.',
    example: 15,
  })
  feedbackCount: number;

  // @ApiProperty({
  //   description: 'The number of staff members in this department.',
  //   example: 5,
  // })
  // staffCount: number;
}

export class DepartmentListResponseDto {
  @ApiProperty({
    description: 'A list of departments.',
    type: [DepartmentDto],
  })
  @Type(() => DepartmentDto)
  results: DepartmentDto[];

  @ApiProperty({
    description: 'The total number of departments matching the query.',
    example: 4,
  })
  total: number;
}
