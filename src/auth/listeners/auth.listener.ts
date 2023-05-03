import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { TokenService } from '../services';

@Injectable()
export class AuthListener {
  constructor(private readonly tokenService: TokenService) {}

  @OnEvent('auth.token.deleteByUserId')
  deleteTokenByUserId(userId: number) {
    this.tokenService.deleteTokensByUserId(userId);
  }
}
