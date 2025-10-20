import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateForwardingDto {
  @ApiProperty({
    example: 3,
    description: 'ID of the department the feedback will be forwarded to',
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  toDepartmentId: number;

  @ApiProperty({
    example:
      'Forwarding this feedback to the IT department for further review.',
    description: 'Optional message or reason for forwarding the feedback',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
