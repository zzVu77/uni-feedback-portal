// users.controller.ts
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user info' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get('/me')
  async getUser(@ActiveUser() actor: ActiveUserData): Promise<UserResponseDto> {
    return this.usersService.getUser(actor);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @Patch('/me')
  async updateMe(
    @ActiveUser() actor: ActiveUserData,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateMe(actor, dto);
  }
}
