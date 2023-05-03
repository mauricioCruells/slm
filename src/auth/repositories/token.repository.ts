import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from '@Config/index';
import { Repository } from 'typeorm';

import { Token } from '../entities';
import { TokenFields } from '../utils';

@CustomRepository(Token)
export class TokenRepository extends Repository<Token> {
  getToken(token: string, tokenField: TokenFields): Promise<Token> {
    try {
      const queryBuilder = this.createQueryBuilder('token')
        .leftJoinAndSelect('token.user', 'user')
        .leftJoinAndSelect('user.role', 'role');
      if (tokenField === 'accessToken') {
        queryBuilder.where(`token.access_token LIKE '%${token}%'`);
      } else {
        queryBuilder.where(`token.refresh_token LIKE '%${token}%'`);
      }
      return queryBuilder.getOne();
    } catch (error) {
      return null;
    }
  }

  async deleteUsingAccessToken(accessToken: string) {
    const token = await this.getToken(accessToken, TokenFields.accessToken);
    if (!token) {
      throw new NotFoundException('No token found');
    }
    this.delete({ id: token.id });
    return;
  }

  async deleteByUserId(userId: number): Promise<void> {
    this.delete({ user: { id: userId } });
    return;
  }
}
