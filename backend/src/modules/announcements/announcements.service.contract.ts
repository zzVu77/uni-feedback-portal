import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import {
  AnnouncementDetailDto,
  AnnouncementListResponseDto,
  QueryAnnouncementsDto,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  QueryStaffAnnouncementsDto,
} from './dto/';

export interface AnnouncementsServiceContract {
  getStaffAnnouncements(
    query: QueryStaffAnnouncementsDto,
    actor: ActiveUserData,
  ): Promise<AnnouncementListResponseDto>;
  getStaffAnnouncementDetail(
    id: string,
    actor: ActiveUserData,
  ): Promise<AnnouncementDetailDto>;
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
