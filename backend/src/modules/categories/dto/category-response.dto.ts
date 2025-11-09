import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CategoryDto {
  @ApiProperty({
    description: 'The unique UUID of the category.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the category.',
    example: 'Academic Affairs',
  })
  name: string;

  @ApiProperty({
    description: 'Indicates if the category is active and can be used.',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The number of feedbacks associated with this category.',
    example: 42,
  })
  feedbackCount: number;
}

export class CategoryListResponseDto {
  @ApiProperty({
    description: 'A list of categories.',
    type: [CategoryDto],
  })
  @Type(() => CategoryDto)
  results: CategoryDto[];

  @ApiProperty({
    description: 'The total number of categories matching the query.',
    example: 25,
  })
  total: number;
}
