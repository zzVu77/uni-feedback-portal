import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
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
  createAnnouncement(
    dto: CreateAnnouncementDto,
    actor: ActiveUserData,
  ): Promise<AnnouncementDetailDto>;
  getAnnouncementDetail(id: string): Promise<AnnouncementDetailDto>;
  updateAnnouncement(
    id: string,
    dto: UpdateAnnouncementDto,
    actor: ActiveUserData,
  ): Promise<AnnouncementDetailDto>;
  deleteAnnouncement(
    id: string,
    actor: ActiveUserData,
  ): Promise<{ success: boolean }>;
}
