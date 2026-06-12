import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { TokenService } from '../token.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}
import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload;
    try {
      payload = await this.tokenService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException();
    }

    // Lazy Evaluation for User Status
    const user = await this.prismaService.users.findUnique({
      where: { id: payload.sub },
    });

    const clearAuthCookies = () => {
      const response = context.switchToHttp().getResponse<Response>();
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        path: '/',
        domain: isProduction ? '.giahuynguyen28.id.vn' : 'localhost',
        secure: isProduction,
        httpOnly: true,
      };
      response.clearCookie('refreshToken', cookieOptions);
      response.clearCookie('accessToken', cookieOptions);
    };

    if (!user || user.status === UserStatus.PERMANENTLY_DELETED) {
      clearAuthCookies();
      throw new ForbiddenException(
        `Tài khoản của bạn đang bị tạm khóa vô thời hạn. Vui lòng liên hệ Admin.`,
      );
    }

    if (user.status === UserStatus.DEACTIVATED) {
      if (user.deactivatedUntil && new Date() > user.deactivatedUntil) {
        await this.prismaService.users.update({
          where: { id: user.id },
          data: { status: UserStatus.ACTIVE, deactivatedUntil: null },
        });
      } else {
        const deactivatedUntil = user.deactivatedUntil
          ? user.deactivatedUntil.toLocaleString()
          : 'không xác định';
        clearAuthCookies();
        throw new ForbiddenException(
          `Tài khoản của bạn đang bị tạm khóa đến [${deactivatedUntil}]. Vui lòng liên hệ Admin.`,
        );
      }
    }

    request[REQUEST_USER_KEY] = payload;
    return true;
  }

  private extractTokenFromCookie(
    request: RequestWithCookies,
  ): string | undefined {
    return request.cookies?.accessToken;
  }
}
