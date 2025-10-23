// import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import {
  AnnouncementDetailDto,
  AnnouncementListResponseDto,
  QueryAnnouncementsDto,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/';

export interface AnnouncementsServiceContract {
  getAnnouncements(
    query: QueryAnnouncementsDto,
  ): Promise<AnnouncementListResponseDto>;
  create(
    dto: CreateAnnouncementDto,
    userId: string,
  ): Promise<AnnouncementDetailDto>;
  getAnnouncementDetail(id: string): Promise<AnnouncementDetailDto>;
  update(
    id: string,
    dto: UpdateAnnouncementDto,
    userId: string,
  ): Promise<AnnouncementDetailDto>;
  delete(id: string, userId: string): Promise<{ success: boolean }>;
}
