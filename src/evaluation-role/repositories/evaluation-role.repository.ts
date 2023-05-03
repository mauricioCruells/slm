import { In, Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { FilterDto, PaginationDto, WhereNameFilter } from '@Core/dto';
import { getORMSkipAndTake } from '@Core/utils';

import { EvaluationRole } from '../entities';

@CustomRepository(EvaluationRole)
export class EvaluationRoleRepository extends Repository<EvaluationRole> {
  findManyBy(filter: FilterDto<WhereNameFilter>): Promise<EvaluationRole[]> {
    return this.createQueryBuilder().select().where(filter.where).getMany();
  }

  findManyByNames(evaluationRoleNames: string[]) {
    return this.createQueryBuilder('evaluation_roles')
      .where(`lower(evaluation_roles.name) IN (:...evaluationRoleNames)`, {
        evaluationRoleNames: evaluationRoleNames.map((name) =>
          name.toLowerCase(),
        ),
      })
      .getMany();
  }

  findOneByName(name: string): Promise<EvaluationRole> {
    return this.findOne({ where: { name } });
  }

  findByIds(ids: number[]): Promise<EvaluationRole[]> {
    return this.find({
      where: {
        id: In(ids),
      },
    });
  }

  findAllRoles(pagination: PaginationDto) {
    const { take, skip } = getORMSkipAndTake(pagination);
    return this.findAndCount({ take, skip });
  }
}
