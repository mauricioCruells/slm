import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/typeorm-ex.decorator';
import { PaginationDto } from '@Core/dto';
import { getORMSkipAndTake } from '@Core/utils';
import { EvaluationRole } from '@Evaluation-Role/entities';

import { Assessment } from '../entities';

@CustomRepository(Assessment)
export class AssessmentRepository extends Repository<Assessment> {
  async getManyByEvaluationRole(
    pagination: PaginationDto,
    evaluationRole: EvaluationRole,
  ): Promise<[Assessment[], number]> {
    const { take, skip } = getORMSkipAndTake(pagination);
    return this.findAndCount({
      relations: [
        'knowledgeArea',
        'knowledgeArea.competencies',
        'knowledgeArea.competencies.evaluationRoles',
      ],
      where: {
        knowledgeArea: {
          competencies: { evaluationRoles: { id: evaluationRole.id } },
        },
      },
      take,
      skip,
    });
  }

  async getAll(pagination: PaginationDto) {
    const { take, skip } = getORMSkipAndTake(pagination);
    return this.findAndCount({
      relations: [
        'knowledgeArea',
        'users',
        'knowledgeArea.competencies',
        'knowledgeArea.competencies.evaluationRoles',
      ],
      take,
      skip,
    });
  }
}
