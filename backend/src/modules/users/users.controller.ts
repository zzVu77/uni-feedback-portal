// users.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAvatarAttachmentDto } from '../uploads/dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create new user' })
  @ApiOkResponse({ type: UserResponseDto })
  @Roles(UserRole.ADMIN)
  @Post('/')
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.createUser(dto);
  }

  @ApiOperation({ summary: 'Get list of users' })
  @Roles(UserRole.ADMIN)
  @Get('/')
  async getUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.getUsers(query);
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get('/me')
  async getUser(@ActiveUser() actor: ActiveUserData): Promise<UserResponseDto> {
    return this.usersService.getUser(actor);
  }

  @ApiOperation({ summary: 'Get user detail by ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @Roles(UserRole.ADMIN)
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiOkResponse({ type: UserResponseDto })
  @Post('upload/avatar')
  async uploadAvatar(
    @ActiveUser() actor: ActiveUserData,
    @Body() fileAttachment: CreateAvatarAttachmentDto,
  ): Promise<UserResponseDto> {
    return this.usersService.uploadAvatar(actor, fileAttachment);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @Patch('update/me')
  async updateMe(
    @ActiveUser() actor: ActiveUserData,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateMe(actor, dto);
  }

  @ApiOperation({ summary: 'Update user detail' })
  @ApiOkResponse({ type: UserResponseDto })
  @Roles(UserRole.ADMIN)
  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'Update user status' })
  @ApiOkResponse({ type: UserResponseDto })
  @Roles(UserRole.ADMIN)
  @Patch('/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUserStatus(id, dto);
  }

  // @ApiOperation({ summary: 'Soft delete user' })
  // // @Roles(UserRole.ADMIN)
  // @Delete('/:id')
  // async softDeleteUser(@Param('id') id: string): Promise<void> {
  //   return this.usersService.softDeleteUser(id);
  // }
}
