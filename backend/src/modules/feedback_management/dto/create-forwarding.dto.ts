import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateForwardingDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID of the department the feedback will be forwarded to',
  })
  @IsString()
  toDepartmentId: string;

  // @ApiProperty({
  //   example:
  //     'Forwarding this feedback to the IT department for further review.',
  //   description: 'Optional message or reason for forwarding the feedback',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // message?: string;
}
