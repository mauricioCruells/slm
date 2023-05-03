import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const authorizedEmails = [
  'icarrasco@applaudostudios.com',
  'jpita@applaudostudios.com',
  'wmartinez@applaudostudios.com',
  'agarcia@applaudostudios.com',
  'jcramirez@applaudostudios.com',
  'cepena@applaudostudios.com',
  'amvelasquez@applaudostudios.com',
  'rsiguenza@applaudostudios.com',
  'mcastro@applaudostudios.com',
  'scalderon@applaudostudios.com',
];

@Injectable({ scope: Scope.REQUEST })
export class RoleChangingUserGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (
      user &&
      authorizedEmails.includes(user?.username) &&
      process.env.NODE_ENV === 'development'
    ) {
      return true;
    }

    throw new UnauthorizedException(
      'User does not have sufficient permissions',
    );
  }
}
