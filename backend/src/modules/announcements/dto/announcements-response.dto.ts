import { ApiProperty, OmitType } from '@nestjs/swagger';
import { FileAttachmentDto } from 'src/modules/uploads/dto';
export class UserInfo {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-44665544000a' })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  userName: string;
}

export class DepartmentInfo {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  id: string;

  @ApiProperty({ example: 'Phòng Nhân sự' })
  name: string;
}
export class AnnouncementDetailDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  id: string;

  @ApiProperty({ example: 'Important Update' })
  title: string;

  @ApiProperty({ example: 'Chi tiết thông báo quan trọng...' })
  content: string;

  @ApiProperty({ example: '2025-09-29T15:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ type: UserInfo })
  user: UserInfo;
  @ApiProperty({ type: DepartmentInfo })
  department: DepartmentInfo;
  @ApiProperty({ type: [FileAttachmentDto] })
  files: FileAttachmentDto[];
}

export class AnnouncementItemDto extends OmitType(AnnouncementDetailDto, [
  'files',
] as const) {}

export class AnnouncementListResponseDto {
  @ApiProperty({ type: [AnnouncementItemDto] })
  results: AnnouncementItemDto[];

  @ApiProperty({
    example: 50,
    description: 'Total number of announcements available',
  })
  total: number;
}
