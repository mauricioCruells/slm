import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@User/entities';

import { BlackListRepository } from '../repositories';
import { TokenService } from './token.service';
import { UserPayload } from '../utils/';
import { LoggedUser, Tokens } from '../docs';

@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tokenService: TokenService,
    private readonly blacklistRepository: BlackListRepository,
  ) {}
  async login(userPayload: UserPayload): Promise<LoggedUser> {
    const { username, uti } = userPayload;
    const [user]: unknown[] = await this.eventEmitter.emitAsync(
      'auth.getUserByEmail',
      username,
    );
    if (user instanceof User) {
      const { accessToken, refreshToken } =
        await this.tokenService.persistTokens(user, uti);
      return {
        email: username,
        role: userPayload.role,
        tokens: { accessToken, refreshToken },
      };
    }
  }

  async refreshToken(token: string): Promise<Tokens> {
    const payload: any = this.tokenService.verifyRefreshToken(token);
    const uti = payload.uti;
    const { accessToken, refreshToken } = await this.tokenService.refreshTokens(
      token,
      uti,
    );
    return { accessToken, refreshToken };
  }

  async logout(request: Request): Promise<void> {
    const bearer = this.tokenService.getTokenFromBearer(request);
    const payload: any = verify(bearer, process.env.ACCESS_TOKEN_SECRET);
    const uti = payload.uti;
    await this.blacklistRepository.addToken(uti);
    return await this.tokenService.deleteTokens(bearer);
  }
}
