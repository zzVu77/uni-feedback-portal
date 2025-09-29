// import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { AnnouncementDetailDto } from './dto/get-announcement-respone-dto';
import { QueryAnnouncementsResponseDto } from './dto/query-announcements-respone.dto';
import { QueryAnnouncementsDto } from './dto/query-announcements.dto';
// import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

export interface AnnouncementsServiceContract {
  list(query: QueryAnnouncementsDto): Promise<QueryAnnouncementsResponseDto>;
  // create(
  //   dto: CreateAnnouncementDto,
  //   actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  // ): Promise<{ id: number; title: string; created_at: string }>;
  get(id: number): Promise<AnnouncementDetailDto>;
  // update(
  //   id: number,
  //   dto: UpdateAnnouncementDto,
  //   actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  // ): Promise<{ id: number; updated_at: string }>;
  // delete(
  //   id: number,
  //   actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  // ): Promise<{ success: true }>;
}
