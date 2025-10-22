import { ApiProperty } from '@nestjs/swagger';
import { UserInfo, DepartmentInfo } from './get-announcement-response-dto';
export class AnnouncementItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440009' })
  id: string;

  @ApiProperty({ example: 'Important Update' })
  title: string;

  @ApiProperty({ example: 'The university will be closed on Friday.' })
  content: string;

  @ApiProperty({ example: '2025-09-29T15:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: UserInfo })
  user: UserInfo;

  @ApiProperty({ type: DepartmentInfo })
  department: DepartmentInfo;
}

export class AnnouncementListResponseDto {
  @ApiProperty({ type: [AnnouncementItemDto] })
  results: AnnouncementItemDto[];

  @ApiProperty({
    example: 50,
    description: 'Total number of announcements available',
  })
  total: number;
}
