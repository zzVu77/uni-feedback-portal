import {
  CreateDepartmentDto,
  DepartmentDto,
  DepartmentListResponseDto,
  QueryDepartmentsDto,
  UpdateDepartmentDto,
  UpdateDepartmentStatusDto,
} from './dto';
import { UserPayload } from './departments.service';
export interface DepartmentsServiceContract {
  CreateDepartment(
    dto: CreateDepartmentDto,
    user: UserPayload,
  ): Promise<DepartmentDto>;

  GetAllDepartments(
    query: QueryDepartmentsDto,
  ): Promise<DepartmentListResponseDto>;

  GetDepartmentById(id: string): Promise<DepartmentDto>;

  UpdateDepartment(
    id: string,
    dto: UpdateDepartmentDto,
    user: UserPayload,
  ): Promise<DepartmentDto>;

  UpdateDepartmentStatus(
    id: string,
    dto: UpdateDepartmentStatusDto,
    user: UserPayload,
  ): Promise<DepartmentDto>;

  DeleteDepartment(id: string, user: UserPayload): Promise<void>;
}
