// users.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserParamDto } from './dto/get-user-param.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Get user by ID
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiParam({ name: 'userId', type: Number, description: 'ID of the user' })
  @Get(':userId')
  async getUser(@Param() params: GetUserParamDto): Promise<UserResponseDto> {
    return this.usersService.getById(params.userId);
  }
}
