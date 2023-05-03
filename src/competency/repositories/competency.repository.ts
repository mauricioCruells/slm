import { In, Repository } from 'typeorm';

import { FilterDto } from '@Core/dto';
import { CustomRepository } from '@Config/index';
import { getORMSkipAndTake } from '@Core/utils';
import { AssessmentIdRaw } from '@AssessmentHistory/interfaces';

import { Competency } from '../entities';
import { CompetencyWhereFilter } from '../dtos';

@CustomRepository(Competency)
export class CompetencyRepository extends Repository<Competency> {
  async findAssessmentIdsByCompetencyId(id: number): Promise<number[]> {
    const assessmentIdsRaw = (await this.createQueryBuilder('competency')
      .select('assessment.id')
      .leftJoin('competency.knowledgeArea', 'knowledgeArea')
      .leftJoin('knowledgeArea.assessments', 'assessment')
      .where('competency.id = :id', { id })
      .getRawMany()) as AssessmentIdRaw[];

    return assessmentIdsRaw
      .filter((assessment) => typeof assessment.assessment_id === 'number')
      .map((assessment) => assessment.assessment_id);
  }

  findManyBy(filter: FilterDto<CompetencyWhereFilter>): Promise<Competency[]> {
    return this.createQueryBuilder('competency')
      .select()
      .where(filter.where)
      .getMany();
  }
  findManyByNames(competencyNames: string[]) {
    return this.createQueryBuilder('competency')
      .where(`lower(competency.name) IN (:...competencyNames)`, {
        competencyNames: competencyNames.map((name) => name.toLowerCase()),
      })
      .getMany();
  }

  findManyByUIDS(competencyUids: string[]) {
    return this.createQueryBuilder('competency')
      .leftJoinAndSelect('competency.skills', 'skill')
      .where(`lower(competency.uid) IN (:...competencyUids)`, {
        competencyUids: competencyUids.map((uid) => uid.toLowerCase()),
      })
      .getMany();
  }

  async findOneCompetencyById(id: number): Promise<Competency> {
    return this.findOne({
      where: { id },
      relations: ['knowledgeArea', 'evaluationRoles', 'user', 'skills'],
    });
  }

  async findCompetencies(pagination): Promise<[Competency[], number]> {
    const { take, skip } = getORMSkipAndTake(pagination);
    return this.findAndCount({
      relations: ['evaluationRoles', 'user', 'skills'],
      take,
      skip,
    });
  }

  async findOneByName(name: string): Promise<Competency> {
    return this.findOne({
      where: { name },
    });
  }

  async findOneByUid(uid: string): Promise<Competency> {
    return this.findOne({
      where: { uid },
      relations: ['skills'],
    });
  }

  async findByIds(ids: number[]): Promise<Competency[]> {
    return this.find({
      where: {
        id: In(ids),
      },
      relations: ['knowledgeArea'],
    });
  }
}
