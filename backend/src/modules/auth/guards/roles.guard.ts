import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log('Role guard: Required Roles:', requiredRoles);

    if (!requiredRoles) {
      return false;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    console.log('Role guard: Active User:', user);
    return user ? requiredRoles.some((role) => user.role === role) : false;
  }
}
