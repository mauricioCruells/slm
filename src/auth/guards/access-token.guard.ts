import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BlackListRepository, TokenRepository } from '../repositories';
import { TokenService } from '../services';
import { TokenFields } from '../utils';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly blackListRepository: BlackListRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const bearer = this.tokenService.getTokenFromBearer(req);

    const isValid = await this.tokenRepository.getToken(
      bearer,
      TokenFields.accessToken,
    );

    const { uti }: any = this.jwtService.decode(bearer);
    const isBlacklisted = await this.blackListRepository.getToken(uti);
    if (!isValid || isBlacklisted) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
