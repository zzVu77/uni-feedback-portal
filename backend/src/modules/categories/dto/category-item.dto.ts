import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the category',
  })
  id: string;

  @ApiProperty({
    example: 'Technology',
    description: 'The name of the category',
  })
  name: string;
}
