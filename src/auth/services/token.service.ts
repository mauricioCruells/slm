import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Request } from 'express';

import { User } from '@User/entities';

import { Token } from '../entities';
import { TokenRepository } from '../repositories';
import { TokenFields } from '../utils';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  generateAccessToken(user: User, uti: string): string {
    const { id, email, role } = user;
    const payload = {
      sub: id,
      username: email,
      role: role.name,
      uti,
    };
    try {
      return this.jwtService.sign(payload);
    } catch {
      throw new InternalServerErrorException(
        `Access token generation failed for ${user.email}`,
      );
    }
  }

  generateRefreshToken(user: User, uti: string): string {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    const expirationPeriod = `${this.configService.get(
      'REFRESH_TOKEN_EXPIRATION',
    )}s`;
    const { id, email, role } = user;
    const payload = {
      sub: id,
      username: email,
      role: role.name,
      uti,
    };
    try {
      return sign(payload, secret, { expiresIn: expirationPeriod });
    } catch {
      throw new InternalServerErrorException(
        `Refresh token generation failed for ${user.email}`,
      );
    }
  }

  persistTokens(user: User, uti: string): Promise<Token> {
    const accessToken = this.generateAccessToken(user, uti);
    const refreshToken = this.generateRefreshToken(user, uti);

    const newToken = this.tokenRepository.create({
      user,
      accessToken,
      refreshToken,
    });

    return this.tokenRepository.save(newToken);
  }

  getTokenFromBearer(req: Request): string {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('Bearer not provided');
    }
    return authorization.split(' ')[1];
  }

  verifyRefreshToken(token: string): string | JwtPayload {
    const secret = this.configService.get('REFRESH_TOKEN_SECRET');
    try {
      return verify(token, secret);
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async refreshTokens(refreshToken: string, uti: string): Promise<Token> {
    const token = await this.tokenRepository.getToken(
      refreshToken,
      TokenFields.refreshToken,
    );
    const userIsInactive = token?.user.status === 'Inactive';
    if (!token || !token.user || userIsInactive) {
      throw new UnauthorizedException('Invalid token');
    }
    const { user } = token;

    await this.tokenRepository.delete({ id: token.id });
    this.verifyRefreshToken(refreshToken);

    return this.persistTokens(user, uti);
  }

  async deleteTokens(accessToken: string): Promise<void> {
    return await this.tokenRepository.deleteUsingAccessToken(accessToken);
  }

  async deleteTokensByUserId(userId: number): Promise<void> {
    return await this.tokenRepository.deleteByUserId(userId);
  }
}
