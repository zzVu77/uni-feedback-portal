import { ApiProperty } from '@nestjs/swagger';
import { AnnouncementFileDto } from './announcement-file.dto';

export class AnnouncementDetailDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  id: string;

  @ApiProperty({ example: 'Important Update' })
  title: string;

  @ApiProperty({ example: 'Chi tiết thông báo quan trọng...' })
  content: string;

  @ApiProperty({ example: '2025-09-29T15:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 'Nguyen Van A' })
  userName: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  departmentId: string;

  @ApiProperty({ example: 'Phòng Nhân sự' })
  departmentName: string;

  @ApiProperty({ type: [AnnouncementFileDto] })
  files: AnnouncementFileDto[];
}
