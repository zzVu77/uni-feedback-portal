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
  UseGuards,
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
  DepartmentOptionResponseDto,
} from './dto';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
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
  createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<DepartmentDto> {
    return this.departmentsService.createDepartment(createDepartmentDto, actor);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of departments' })
  @ApiResponse({
    status: 200,
    description: 'A list of departments.',
    type: DepartmentListResponseDto,
  })
  getAllDepartments(
    @Query() query: QueryDepartmentsDto,
  ): Promise<DepartmentListResponseDto> {
    return this.departmentsService.getAllDepartments(query);
  }
  @Get('options')
  @ApiOperation({ summary: 'Get a list of departments' })
  @ApiResponse({
    status: 200,
    description: 'A list of departments.',
    type: [DepartmentOptionResponseDto],
  })
  getDepartmentOptions(): Promise<DepartmentOptionResponseDto[]> {
    return this.departmentsService.getDepartmentOptions();
  }

  @Get(':departmentId')
  @ApiOperation({ summary: 'Get a single department by ID' })
  @ApiResponse({
    status: 200,
    description: 'Department details retrieved successfully.',
    type: DepartmentDto,
  })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  getDepartmentById(
    @Param() params: DepartmentParamDto,
  ): Promise<DepartmentDto> {
    return this.departmentsService.getDepartmentById(params.departmentId);
  }

  @Patch(':departmentId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
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
  updateDepartment(
    @Param() params: DepartmentParamDto,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<DepartmentDto> {
    return this.departmentsService.updateDepartment(
      params.departmentId,
      updateDepartmentDto,
      actor,
    );
  }

  @Patch(':departmentId/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activate or deactivate a department (Admin only)' })
  @ApiBody({ type: UpdateDepartmentStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Department status updated successfully.',
    type: DepartmentDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  updateDepartmentStatus(
    @Param() params: DepartmentParamDto,
    @Body() updateStatusDto: UpdateDepartmentStatusDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<DepartmentDto> {
    return this.departmentsService.updateDepartmentStatus(
      params.departmentId,
      updateStatusDto,
      actor,
    );
  }

  @Delete(':departmentId/permanent')
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
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
  deleteDepartment(
    @Param() params: DepartmentParamDto,
    @ActiveUser() actor: ActiveUserData,
  ): Promise<void> {
    return this.departmentsService.deleteDepartment(params.departmentId, actor);
  }
}
