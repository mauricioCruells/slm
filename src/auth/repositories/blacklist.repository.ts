import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';

import { Blacklist } from '../entities';

@CustomRepository(Blacklist)
export class BlackListRepository extends Repository<Blacklist> {
  getToken(uti: string): Promise<Blacklist> {
    try {
      const queryBuilder = this.createQueryBuilder('blacklist').where(
        `blacklist.uti LIKE '%${uti}%'`,
      );
      return queryBuilder.getOne();
    } catch (error) {
      return null;
    }
  }

  addToken(uti: string) {
    const token = this.create({ uti });
    return this.save(token);
  }
}
