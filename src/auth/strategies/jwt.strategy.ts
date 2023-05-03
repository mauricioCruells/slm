import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '@User/entities';
import { StatusEnum } from '@Core/enums';

import { UserPayload } from '../utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload): Promise<UserPayload> {
    const { sub, username, role, uti } = payload;

    const [user]: unknown[] = await this.eventEmitter.emitAsync(
      'auth.getOneUserById',
      sub,
    );
    if (user instanceof User) {
      const userIsInactive = user.status === StatusEnum.INACTIVE;
      if (userIsInactive) {
        throw new UnauthorizedException(`User is inactive`);
      }
      return { sub, username, role, uti };
    }
  }
}
