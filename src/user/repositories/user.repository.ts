import { Brackets, Repository } from 'typeorm';

import { getORMSkipAndTake } from '@Core/utils';
import { CustomRepository } from '@Config/index';
import { PaginationDto, FilterDto } from '@Core/dto';
import { ReportQueryDto } from '@Report/dto';

import { User } from '../entities';
import { UserParamDto, UserWhereFilter } from '../dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  getAllUsers(pagination: PaginationDto) {
    const { take, skip } = getORMSkipAndTake(pagination);
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.evaluationRole', 'evaluationRole')
      .leftJoinAndSelect('user.seniorityLevel', 'seniorityLevel')
      .orderBy('user.status', 'ASC')
      .addOrderBy('user.firstName', 'ASC')
      .take(take)
      .skip(skip);
    return queryBuilder.getManyAndCount();
  }

  getOneById(id: number) {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.evaluationRole', 'evaluationRole')
      .leftJoinAndSelect('user.seniorityLevel', 'seniorityLevel')
      .where(`user.id = ${id}`);
    return queryBuilder.getOne();
  }

  getOneByEmail(filter: UserParamDto) {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.evaluationRole', 'evaluationRole')
      .leftJoinAndSelect('user.seniorityLevel', 'seniorityLevel')
      .where(`user.email ILIKE '%${filter.email}%'`);
    return queryBuilder.getOne();
  }

  getByEmail(filter: UserParamDto) {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.evaluationRole', 'evaluationRole')
      .leftJoinAndSelect('user.seniorityLevel', 'seniorityLevel')
      .where(`user.email ILIKE '%${filter.email}%'`);
    return queryBuilder.getMany();
  }

  findManyBy(filter: FilterDto<UserWhereFilter>): Promise<User[]> {
    return this.createQueryBuilder('user')
      .select()
      .leftJoinAndSelect('user.seniorityLevel', 'seniorityLevel')
      .where(filter.where)
      .getMany();
  }

  findManyForReport(reportQuery: ReportQueryDto) {
    const {
      knowledgeAreaIds,
      evaluationRoleIds,
      names,
      emails,
      seniorityLevelIds,
      userIds,
    } = reportQuery;

    const hasNameFilter = names && names.length > 0;

    const hasEmailFilter = emails && emails.length > 0;

    const hasSeniorityFilter =
      seniorityLevelIds && seniorityLevelIds.length > 0;

    const hasKnowledgeAreasFilter =
      knowledgeAreaIds && knowledgeAreaIds.length > 0;

    const hasEvaluationRolesFilter =
      evaluationRoleIds && evaluationRoleIds.length > 0;

    const hasCustomSort = reportQuery.sort && reportQuery.sort.length > 0;

    const hasUsersFilter =
      reportQuery.userIds && reportQuery.userIds.length > 0;

    const queryBuilder = this.createQueryBuilder('user')
      .leftJoin('user.assessments', 'assessment')
      .leftJoin('assessment.knowledgeArea', 'AknowledgeArea')
      .leftJoin('assessment.evaluationRoles', 'AevaluationRole')
      .leftJoin('user.completedAssessments', 'completedAssessment')
      .leftJoin('completedAssessment.knowledgeArea', 'CknowledgeArea')
      .leftJoin('completedAssessment.evaluationRoles', 'CevaluationRole')
      .leftJoin('user.evaluationRole', 'evaluationRole')
      .leftJoin('user.seniorityLevel', 'seniorityLevel')
      .select([
        'user.id',
        'user.employeeID',
        'user.firstName',
        'user.lastName',
        'user.email',
        'evaluationRole.id',
        'evaluationRole.name',
        'seniorityLevel.id',
        'seniorityLevel.name',
        'assessment.id',
        'completedAssessment.id',
      ]);

    const filters: Brackets[] = [];

    if (hasNameFilter) {
      filters.push(
        new Brackets((qb) => {
          qb.where('user.firstName ILIKE ANY(:names)', {
            names: names.map((name) => `%${name}%`),
          }).orWhere('user.lastName ILIKE ANY(:names)', {
            names: names.map((name) => `%${name}%`),
          });
        }),
      );
    }

    if (hasEmailFilter) {
      filters.push(
        new Brackets((qb) => {
          qb.where('user.email ILIKE ANY(:emails)', {
            emails: emails.map((email) => `%${email}%`),
          });
        }),
      );
    }

    if (hasSeniorityFilter) {
      filters.push(
        new Brackets((qb) => {
          qb.where('seniorityLevel.id IN (:...seniorityLevelIds)', {
            seniorityLevelIds,
          });
        }),
      );
    }

    if (hasKnowledgeAreasFilter) {
      filters.push(
        new Brackets((qb) => {
          qb.where('AknowledgeArea.id IN (:...KAid)', {
            KAid: knowledgeAreaIds,
          }).orWhere('CknowledgeArea.id IN (:...KAid)', {
            KAid: knowledgeAreaIds,
          });
        }),
      );
    }

    if (hasEvaluationRolesFilter) {
      filters.push(
        new Brackets((qb) => {
          qb.where('AevaluationRole.id IN (:...ERid)', {
            ERid: evaluationRoleIds,
          }).orWhere('CevaluationRole.id IN (:...ERid)', {
            ERid: evaluationRoleIds,
          });
        }),
      );
    }

    //join all Bracket filters together in the correct order
    if (filters.length > 0) {
      queryBuilder.where(
        new Brackets((qb) => {
          filters.forEach((filter, index) => {
            if (index === 0) {
              qb.where(filter);
            } else {
              qb.orWhere(filter);
            }
          });
        }),
      );
    }

    if (hasUsersFilter) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.id IN (:...userId)', { userId: userIds });
        }),
      );
    }

    // regardless of the filters, only include users with at least one assessment
    // queryBuilder.andWhere(
    //   new Brackets((qb) => {
    //     qb.where('assessment.id IS NOT NULL').orWhere(
    //       'completedAssessment.id IS NOT NULL',
    //     );
    //   }),
    // );

    if (hasCustomSort) {
      reportQuery.sort.forEach((option) => {
        queryBuilder.addOrderBy(option.sortField, option.sortOrder);
      });
    } else {
      queryBuilder.addOrderBy('user.firstName', 'ASC');
    }

    return queryBuilder.getMany();
  }

  findOneByEmployeeId(employeeID: string) {
    return this.findOneBy({ employeeID });
  }
}
