import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementParamDto {
  @ApiProperty({ description: 'ID of the announcement', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
