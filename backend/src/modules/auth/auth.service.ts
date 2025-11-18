import {
  Inject,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from './hashing.service';
import { AuthResponseDto } from './dto';
import { Users } from '@prisma/client';
import { TokenService } from './token.service';
import jwtConfig from '../../config/jwt.config';
import { AuthServiceContract } from './auth.service.contract';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto';
import { REDIS_CLIENT } from '../redis/redis.module';
import { Redis } from '@upstash/redis';

@Injectable()
export class AuthService implements AuthServiceContract {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  async Login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(user);
  }

  async RefreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const { sub, refreshTokenId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      const user = await this.prismaService.users.findUniqueOrThrow({
        where: { id: sub },
      });

      const refreshTokenRecord =
        await this.prismaService.refreshTokens.findUnique({
          where: { token: refreshTokenId },
        });

      if (!refreshTokenRecord) {
        throw new UnauthorizedException('Refresh token not found');
      }

      await this.prismaService.refreshTokens.delete({
        where: { token: refreshTokenId },
      });

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async Logout(refreshToken: string): Promise<void> {
    try {
      const { refreshTokenId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      // Using deleteMany to avoid an error if the token is already deleted.
      // This makes the logout operation idempotent.
      await this.prismaService.refreshTokens.deleteMany({
        where: { token: refreshTokenId },
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpKey = `reset-otp:${email}`;

      await this.redisClient.set(otpKey, otp, { ex: 300 });

      await this.mailService.sendPasswordResetOtp(email, otp);
    }

    return {
      message:
        'If an account with this email exists, a password reset OTP has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { email, otp, newPassword } = dto;
    const otpKey = `reset-otp:${email}`;
    const storedOtp = await this.redisClient.get<string>(otpKey);

    const isOtpValid =
      storedOtp != null && String(storedOtp).trim() === String(otp).trim();

    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const hashedPassword = await this.hashingService.hash(newPassword);

    await this.prismaService.users.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await this.redisClient.del(otpKey);

    return { message: 'Password has been reset successfully.' };
  }

  private async generateTokens(user: Users): Promise<AuthResponseDto> {
    const { accessToken, refreshToken, refreshTokenId } =
      await this.tokenService.generateTokens(user);

    await this.prismaService.refreshTokens.create({
      data: {
        token: refreshTokenId,
        userId: user.id,
        expiredAt: new Date(
          Date.now() + parseInt(jwtConfig.JWT_REFRESH_TOKEN_TTL) * 1000,
        ),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
