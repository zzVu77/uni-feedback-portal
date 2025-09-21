import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { QueryAnnouncementsDto } from './dto/query-announcements.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

export interface AnnouncementsServiceContract {
  list(query: QueryAnnouncementsDto): Promise<{
    items: Array<{
      id: number;
      title: string;
      excerpt: string;
      user_id: number;
      created_at: string;
    }>;
    total: number;
  }>;
  create(
    dto: CreateAnnouncementDto,
    actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  ): Promise<{ id: number; title: string; created_at: string }>;
  get(id: number): Promise<{
    id: number;
    title: string;
    content: string;
    created_at: string;
    user: { user_id: number; full_name: string | null };
    files: Array<{ id: number; file_name: string; file_url: string }>;
  }>;
  update(
    id: number,
    dto: UpdateAnnouncementDto,
    actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  ): Promise<{ id: number; updated_at: string }>;
  delete(
    id: number,
    actor: { user_id: number; role: 'DepartmentStaff' | 'Admin' },
  ): Promise<{ success: true }>;
}
