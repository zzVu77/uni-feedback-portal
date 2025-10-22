import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateForwardingDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID of the department the feedback will be forwarded to',
  })
  @IsString()
  toDepartmentId: string;

  @ApiProperty({
    example: 'Please review this feedback for further action.',
    description: 'Optional note accompanying the forwarding',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
