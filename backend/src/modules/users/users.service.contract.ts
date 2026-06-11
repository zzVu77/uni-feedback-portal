import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateAvatarAttachmentDto } from '../uploads/dto';

export interface UsersServiceContract {
  getUser(actor: ActiveUserData): Promise<UserResponseDto>;
  updateMe(
    actor: ActiveUserData,
    dto: UpdateProfileDto,
  ): Promise<UserResponseDto>;
  uploadAvatar(
    actor: ActiveUserData,
    fileAttachment: CreateAvatarAttachmentDto,
  ): Promise<UserResponseDto>;
  createUser(dto: CreateUserDto): Promise<UserResponseDto>;
  getUsers(
    query: GetUsersQueryDto,
  ): Promise<{ results: UserResponseDto[]; total: number }>;
  getUserById(id: string): Promise<UserResponseDto>;
  updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto>;
  updateUserStatus(
    id: string,
    dto: UpdateUserStatusDto,
  ): Promise<UserResponseDto>;
}
