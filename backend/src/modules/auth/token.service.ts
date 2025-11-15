import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { randomUUID } from 'crypto';
import jwtConfig from '../../config/jwt.config';
import { ActiveUserData } from './interfaces/active-user-data.interface';

type RefreshTokenPayload = Pick<ActiveUserData, 'sub'> & {
  refreshTokenId: string;
};

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(user: Users) {
    const refreshTokenId = randomUUID();
    console.log('Generating tokens for user:', user.id);
    const accessTokenPayload: Partial<ActiveUserData> = {
      role: user.role,
      ...(user.departmentId && { departmentId: user.departmentId }),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        parseInt(jwtConfig.JWT_ACCESS_TOKEN_TTL),
        accessTokenPayload,
        jwtConfig.JWT_ACCESS_SECRET,
      ),
      this.signToken(
        user.id,
        parseInt(jwtConfig.JWT_REFRESH_TOKEN_TTL),
        { refreshTokenId },
        jwtConfig.JWT_REFRESH_SECRET,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      refreshTokenId,
    };
  }

  async verifyAccessToken(token: string): Promise<ActiveUserData> {
    return this.jwtService.verifyAsync<ActiveUserData>(token, {
      secret: jwtConfig.JWT_ACCESS_SECRET,
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
      secret: jwtConfig.JWT_REFRESH_SECRET,
    });
  }

  private async signToken<T>(
    userId: string,
    expiresIn: number,
    payload: T,
    secret: string,
  ) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret,
        expiresIn,
      },
    );
  }
}
