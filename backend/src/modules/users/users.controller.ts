// users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
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
}
