import { ApiProperty } from '@nestjs/swagger';
import { AnnouncementFileDto } from './announcement-file.dto';

export class AnnouncementDetailDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Important Update' })
  title: string;

  @ApiProperty({ example: 'Chi tiết thông báo quan trọng...' })
  content: string;

  @ApiProperty({ example: '2025-09-29T15:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: 'Nguyen Van A' })
  user_name: string;

  @ApiProperty({ example: 2 })
  department_id: number;

  @ApiProperty({ example: 'Phòng Nhân sự' })
  department_name: string;

  @ApiProperty({ type: [AnnouncementFileDto] })
  files: AnnouncementFileDto[];
}
