import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from './dto';
import { Public } from './decorators/public.decorator';
import type { Request, Response } from 'express';
import jwtConfig from '../../config/jwt.config';
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    description: 'User logged in successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  async Login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const tokens = await this.authService.Login(
      loginDto.email,
      loginDto.password,
    );
    this.setAuthCookies(response, tokens);
    return { message: 'Login successful' };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset OTP' })
  @ApiResponse({
    status: 200,
    description: 'If an account with this email exists, an OTP will be sent.',
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    description: 'Access token refreshed successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token.',
  })
  async RefreshToken(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const refreshTokenFromCookie = request.cookies?.refreshToken;
    if (!refreshTokenFromCookie) {
      throw new UnauthorizedException('Refresh token not found in cookie.');
    }
    const tokens = await this.authService.RefreshToken(refreshTokenFromCookie);
    this.setAuthCookies(response, tokens);
    return { message: 'Access token refreshed' };
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiOkResponse({ description: 'User logged out successfully.' })
  async Logout(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const refreshToken = request.cookies?.refreshToken;
    if (refreshToken) {
      await this.authService.Logout(refreshToken);
    }
    response.clearCookie('accessToken', { path: '/' });
    response.clearCookie('refreshToken', { path: '/' });
    return { message: 'Logout successful' };
  }

  private setAuthCookies(response: Response, tokens: AuthResponseDto) {
    const isProduction = process.env.NODE_ENV === 'production';
    const accessTokenMaxAge = parseInt(jwtConfig.JWT_ACCESS_TOKEN_TTL) * 1000;
    const refreshTokenMaxAge = parseInt(jwtConfig.JWT_REFRESH_TOKEN_TTL) * 1000;

    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: accessTokenMaxAge,
      path: '/',
      sameSite: 'strict',
    });
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: refreshTokenMaxAge,
      path: '/',
      sameSite: 'strict',
    });
  }
}
