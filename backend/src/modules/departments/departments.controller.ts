import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateDepartmentDto,
  DepartmentParamDto,
  DepartmentDto,
  DepartmentListResponseDto,
  QueryDepartmentsDto,
  UpdateDepartmentStatusDto,
  UpdateDepartmentDto,
} from './dto';
import { UserRole } from '@prisma/client';

/**
 * TEMPORARY: Defines the structure of the user object attached to the request.
 * This will be moved to a shared location after refactoring.
 */
export interface UserPayload {
  userId: string;
  role: UserRole;
}

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  // Dummy user payload for demonstration. In a real app, this would come from a custom decorator.
  private readonly dummyUser: UserPayload = {
    userId: '550e8400-e29b-41d4-a716-446655440008', // Admin User ID
    role: UserRole.ADMIN,
  };

  @Post()
  @ApiOperation({ summary: 'Create a new department (Admin only)' })
  @ApiBody({ type: CreateDepartmentDto })
  @ApiResponse({
    status: 201,
    description: 'The department has been successfully created.',
    type: DepartmentDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Department email already exists.',
  })
  CreateDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentDto> {
    return this.departmentsService.CreateDepartment(
      createDepartmentDto,
      this.dummyUser,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of departments' })
  @ApiResponse({
    status: 200,
    description: 'A list of departments.',
    type: DepartmentListResponseDto,
  })
  GetAllDepartments(
    @Query() query: QueryDepartmentsDto,
  ): Promise<DepartmentListResponseDto> {
    return this.departmentsService.GetAllDepartments(query);
  }

  @Get(':departmentId')
  @ApiOperation({ summary: 'Get a single department by ID' })
  @ApiResponse({
    status: 200,
    description: 'Department details retrieved successfully.',
    type: DepartmentDto,
  })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  GetDepartmentById(
    @Param() params: DepartmentParamDto,
  ): Promise<DepartmentDto> {
    return this.departmentsService.GetDepartmentById(params.departmentId);
  }

  @Patch(':departmentId')
  @ApiOperation({ summary: 'Update a department (Admin only)' })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({
    status: 200,
    description: 'The department has been successfully updated.',
    type: DepartmentDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. Department email already exists.',
  })
  UpdateDepartment(
    @Param() params: DepartmentParamDto,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentDto> {
    return this.departmentsService.UpdateDepartment(
      params.departmentId,
      updateDepartmentDto,
      this.dummyUser,
    );
  }

  @Patch(':departmentId/status')
  @ApiOperation({ summary: 'Activate or deactivate a department (Admin only)' })
  @ApiBody({ type: UpdateDepartmentStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Department status updated successfully.',
    type: DepartmentDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  UpdateDepartmentStatus(
    @Param() params: DepartmentParamDto,
    @Body() updateStatusDto: UpdateDepartmentStatusDto,
  ): Promise<DepartmentDto> {
    return this.departmentsService.UpdateDepartmentStatus(
      params.departmentId,
      updateStatusDto,
      this.dummyUser,
    );
  }

  @Delete(':departmentId/permanent')
  @HttpCode(204)
  @ApiOperation({ summary: 'Permanently delete a department (Admin only)' })
  @ApiResponse({
    status: 204,
    description: 'Department successfully deleted permanently.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Department may be in use or user is not an admin.',
  })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  DeleteDepartment(@Param() params: DepartmentParamDto): Promise<void> {
    return this.departmentsService.DeleteDepartment(
      params.departmentId,
      this.dummyUser,
    );
  }
}
