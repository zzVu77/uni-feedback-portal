import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '123456789', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.DEPARTMENT_STAFF,
    description: 'Role',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    example: 'd0000000-0000-0000-0000-000000000001',
    description: 'Department ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  departmentId?: string;
}
