import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { TokenService } from '../token.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('AccessTokenGuard: Checking access permissions');
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    console.log('AccessTokenGuard: extracted token=', token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      console.log('AccessTokenGuard: token payload=', payload);
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(
    request: RequestWithCookies,
  ): string | undefined {
    return request.cookies?.accessToken;
  }
}
