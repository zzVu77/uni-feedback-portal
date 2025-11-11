import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'The name of the department.',
    example: 'Faculty of Computer Science',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'The contact email for the department.',
    example: 'cs.faculty@university.edu',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'A brief description of the department.',
    example: 'Responsible for all computer science and engineering courses.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The physical location of the department office.',
    example: 'Building E, 4th Floor',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'The contact phone number for the department.',
    example: '123-456-7894',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
