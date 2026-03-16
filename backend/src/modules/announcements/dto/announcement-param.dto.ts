import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AnnouncementParamDto {
  @ApiProperty({
    description: 'ID of the announcement',
    example: '550e8400-e29b-41d4-a716-44665544004d',
  })
  @IsUUID('loose')
  id: string;
}
