import { BearerStrategy } from 'passport-azure-ad';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@User/entities';

import { BlackListRepository } from '../repositories';
import { UserPayload } from '../utils';

@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad',
) {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly blackListRepository: BlackListRepository,
  ) {
    const clientID = process.env.CLIENT_ID;
    const tenantId = process.env.TENANT_ID;
    super({
      identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
      clientID,
      validateIssuer: true,
      logginLevel: 'info',
    });
  }

  async validate(payload: any): Promise<UserPayload> {
    const [allowedUser]: unknown[] = await this.eventEmitter.emitAsync(
      'auth.getUserByEmail',
      payload?.preferred_username,
    );
    if (allowedUser instanceof User) {
      const userIsInactive = allowedUser.status == 'Inactive';
      const tokenIsBlacklisted = await this.blackListRepository.getToken(
        payload?.uti,
      );
      if (userIsInactive) {
        throw new UnauthorizedException('User is inactive');
      }
      if (!allowedUser || tokenIsBlacklisted) return null;

      return {
        sub: allowedUser.id,
        username: payload?.preferred_username,
        role: allowedUser.role.name,
        uti: payload?.uti,
      };
    }
    return null;
  }
}
