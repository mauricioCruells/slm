import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '@Role/enums';

import { ROLES_METADATA_KEY } from '../decorators';

@Injectable({ scope: Scope.REQUEST })
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const roles =
      this.reflector.get<string[]>(ROLES_METADATA_KEY, context.getHandler()) ||
      this.reflector.get<string[]>(ROLES_METADATA_KEY, context.getClass());
    if (!roles || roles[0] === UserRole.ALL) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && roles.includes(user?.role)) {
      return true;
    }

    throw new UnauthorizedException(
      'User does not have sufficient permissions',
    );
  }
}
