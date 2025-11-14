import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponseDto, LoginDto, RefreshTokenDto } from './dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // Mark this endpoint as public
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    description: 'User logged in successfully.',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  Login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.Login(loginDto.email, loginDto.password);
  }

  @Public() // Mark this endpoint as public
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    description: 'Access token refreshed successfully.',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token.',
  })
  RefreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.RefreshToken(refreshTokenDto.refreshToken);
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'User logout' })
  @ApiOkResponse({ description: 'User logged out successfully.' })
  Logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    return this.authService.Logout(refreshTokenDto.refreshToken);
  }
}
