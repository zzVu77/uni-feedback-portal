import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserResponseDto } from './dto/user-response.dto';

export interface UsersServiceContract {
  getUser(actor: ActiveUserData): Promise<UserResponseDto>;
  updateMe(
    actor: ActiveUserData,
    dto: UpdateProfileDto,
  ): Promise<UserResponseDto>;
}
