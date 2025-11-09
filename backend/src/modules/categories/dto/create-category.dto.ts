import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category.',
    example: 'Academic Affairs',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;
}
