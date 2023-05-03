import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';

import { Option } from '../entities';

@CustomRepository(Option)
export class OptionRepository extends Repository<Option> {
  async getOneById(id: number): Promise<Option> {
    return this.findOne({ where: { id } });
  }
}
