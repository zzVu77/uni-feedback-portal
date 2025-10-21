import { ApiProperty } from '@nestjs/swagger';

export class AnnouncementItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  id: string;

  @ApiProperty({ example: 'Important Update' })
  title: string;

  @ApiProperty({ example: 'The university will be closed on Friday.' })
  content: string;

  @ApiProperty({ example: '2025-09-29T15:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  userId: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  userName: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  departmentId: string;

  @ApiProperty({ example: 'Phòng Nhân sự' })
  departmentName: string;
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
