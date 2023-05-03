import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { FilterDto, WhereNameFilter } from '@Core/dto';

import { Role } from '../entities';

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {
  getOneBy(filter: FilterDto<WhereNameFilter>): Promise<Role> {
    return this.createQueryBuilder().select().where(filter.where).getOne();
  }
  findRoles() {
    return this.find();
  }
  getOneById(id: number) {
    return this.findOneBy({ id });
  }
  getOneByAlias(alias: string) {
    return this.findOneBy({ alias });
  }
  getOneByDescription(description: string) {
    return this.findOneBy({ description });
  }
}
