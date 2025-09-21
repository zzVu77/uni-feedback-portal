import { UserResponseDto } from './dto/user-response.dto';
export interface UsersServiceContract {
  getMe(userId: number): Promise<UserResponseDto>;
  getById(
    userId: number,
    requester: {
      role: 'Admin' | 'DepartmentStaff' | 'Student';
      requesterId: number;
      department_id: number;
    },
  ): Promise<UserResponseDto>;
}
