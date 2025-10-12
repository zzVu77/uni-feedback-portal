import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Important Update' })
  title: string;

  @ApiProperty({ example: 'The university will be closed on Friday.' })
  content: string;

  @ApiProperty({ example: '2025-09-29T15:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: 10 })
  user_id: number;

  @ApiProperty({ example: 'Nguyen Van A' })
  user_name: string;

  @ApiProperty({ example: 2 })
  department_id: number;

  @ApiProperty({ example: 'Phòng Nhân sự' })
  department_name: string;
}

export class AnnouncementListResponseDto {
  @ApiProperty({ type: [AnnouncementItemDto] })
  results: AnnouncementItemDto[];

  @ApiProperty({
    example: 50,
    description: 'Tổng số announcements thỏa điều kiện (dùng cho pagination)',
  })
  total: number;
}
