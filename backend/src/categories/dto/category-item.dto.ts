import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the category',
  })
  categoryId: number;

  @ApiProperty({
    example: 'Technology',
    description: 'The name of the category',
  })
  categoryName: string;
}
