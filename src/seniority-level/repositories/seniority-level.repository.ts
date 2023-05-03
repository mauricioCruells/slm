import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { FilterDto, WhereNameFilter } from '@Core/dto';

import { SeniorityLevel } from '../entities';

@CustomRepository(SeniorityLevel)
export class SeniorityLevelRepository extends Repository<SeniorityLevel> {
  getByFilters(filter: FilterDto<WhereNameFilter>): Promise<SeniorityLevel[]> {
    return this.createQueryBuilder().select().where(filter.where).getMany();
  }

  findOneSLById(id: number): Promise<SeniorityLevel> {
    return this.findOne({ where: { id } });
  }
}
