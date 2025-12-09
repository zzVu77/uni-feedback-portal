import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryParamDto {
  @ApiProperty({
    description: 'The UUID of the category.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  categoryId: string;
}
