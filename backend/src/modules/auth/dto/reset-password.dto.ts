import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty({ example: 'newSecurePassword123' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 100)
  newPassword: string;
}
