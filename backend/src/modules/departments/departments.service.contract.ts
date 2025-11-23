import {
  CreateDepartmentDto,
  DepartmentDto,
  DepartmentListResponseDto,
  DepartmentOptionResponseDto,
  QueryDepartmentsDto,
  UpdateDepartmentDto,
  UpdateDepartmentStatusDto,
} from './dto';
import { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

export interface DepartmentsServiceContract {
  createDepartment(
    dto: CreateDepartmentDto,
    actor: ActiveUserData,
  ): Promise<DepartmentDto>;

  getAllDepartments(
    query: QueryDepartmentsDto,
  ): Promise<DepartmentListResponseDto>;

  getDepartmentOptions(): Promise<DepartmentOptionResponseDto[]>;

  getDepartmentById(id: string): Promise<DepartmentDto>;

  updateDepartment(
    id: string,
    dto: UpdateDepartmentDto,
    actor: ActiveUserData,
  ): Promise<DepartmentDto>;

  updateDepartmentStatus(
    id: string,
    dto: UpdateDepartmentStatusDto,
    actor: ActiveUserData,
  ): Promise<DepartmentDto>;

  deleteDepartment(id: string, actor: ActiveUserData): Promise<void>;
}
