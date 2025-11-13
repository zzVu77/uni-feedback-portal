import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from './hashing.service';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import { ActiveUserData } from './interfaces/active-user-data.interface';

import { AuthResponseDto } from './dto';
import { Users } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async login(email: string, password: string): Promise<AuthResponseDto> {
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

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshToken, {
        secret: this.jwtConfiguration.refreshSecret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

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

  async logout(refreshToken: string): Promise<void> {
    try {
      const { refreshTokenId } = await this.jwtService.verifyAsync<{
        refreshTokenId: string;
      }>(refreshToken, {
        secret: this.jwtConfiguration.refreshSecret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      await this.prismaService.refreshTokens.delete({
        where: { token: refreshTokenId },
      });
    } catch {
      return;
    }
  }

  private async generateTokens(user: Users): Promise<AuthResponseDto> {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { role: user.role },
        this.jwtConfiguration.accessSecret,
      ),
      this.signToken(
        user.id,
        this.jwtConfiguration.refreshTokenTtl,
        {
          refreshTokenId,
        },
        this.jwtConfiguration.refreshSecret,
      ),
    ]);

    await this.prismaService.refreshTokens.create({
      data: {
        token: refreshTokenId,
        userId: user.id,
        expiredAt: new Date(
          Date.now() + this.jwtConfiguration.refreshTokenTtl * 1000,
        ),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
    secret?: string,
  ) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: secret,
        expiresIn,
      },
    );
  }
}
