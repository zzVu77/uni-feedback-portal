import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementParamDto {
  @ApiProperty({
    description: 'ID of the announcement',
    example: '550e8400-e29b-41d4-a716-44665544004d',
  })
  @IsString()
  id: string;
}
