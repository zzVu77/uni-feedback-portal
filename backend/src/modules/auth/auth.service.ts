import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from './hashing.service';
import { AuthResponseDto } from './dto';
import { Users } from '@prisma/client';
import { TokenService } from './token.service';
import jwtConfig from '../../config/jwt.config';
import { AuthServiceContract } from './auth.service.contract';

@Injectable()
export class AuthService implements AuthServiceContract {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
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
      // If token verification fails, we throw an error.
      // The client should not be told the logout was "successful"
      // if the token was invalid in the first place.
      throw new UnauthorizedException('Invalid refresh token');
    }
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
