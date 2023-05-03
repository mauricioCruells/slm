import { In, Repository } from 'typeorm';

import { FilterDto, PaginationDto } from '@Core/dto';
import { CustomRepository } from '@Config/index';
import { getORMSkipAndTake } from '@Core/utils';
import { AssessmentIdRaw } from '@AssessmentHistory/interfaces';

import { KnowledgeArea } from '../entities';
import { KnowledgeAreaWhereFilter } from '../dtos';

@CustomRepository(KnowledgeArea)
export class KnowledgeAreaRepository extends Repository<KnowledgeArea> {
  async findAssessmentIdsByKnowledgeAreaId(id: number): Promise<number[]> {
    const assessmentIdsRaw = (await this.createQueryBuilder('knowledgeArea')
      .select('assessment.id')
      .leftJoin('knowledgeArea.assessments', 'assessment')
      .where('knowledgeArea.id = :id', { id })
      .getRawMany()) as AssessmentIdRaw[];

    return assessmentIdsRaw
      .filter((assessment) => typeof assessment.assessment_id === 'number')
      .map((assessment) => assessment.assessment_id);
  }

  findManyBy(
    filter: FilterDto<KnowledgeAreaWhereFilter>,
  ): Promise<KnowledgeArea[]> {
    return this.createQueryBuilder('knowledge_area')
      .select()
      .where(filter.where)
      .getMany();
  }
  findManyByNames(knowledgeAreaNames: string[]): Promise<KnowledgeArea[]> {
    return this.createQueryBuilder('knowledge_area')
      .where(`lower(knowledge_area.name) IN (:...knowledgeAreaNames)`, {
        knowledgeAreaNames: knowledgeAreaNames.map((name) =>
          name.toLowerCase(),
        ),
      })
      .getMany();
  }

  findManyByName(name: string): Promise<KnowledgeArea[]> {
    const queryBuilder = this.createQueryBuilder('knowledge_area').where(
      `knowledge_area.name ILIKE '%${name}%'`,
    );
    return queryBuilder.getMany();
  }

  findOneKnowledgeAreaById(id: number): Promise<KnowledgeArea> {
    return this.findOne({
      where: { id },
      relations: ['competencies'],
    });
  }

  findAll(): Promise<KnowledgeArea[]> {
    return this.find({
      relations: ['competencies'],
    });
  }

  findOneByName(name: string): Promise<KnowledgeArea> {
    return this.findOne({
      where: { name },
    });
  }

  findOneByUid(uid: string): Promise<KnowledgeArea> {
    return this.findOne({
      where: { uid },
    });
  }

  getAllKnowledgeAreasPaginated(pagination: PaginationDto) {
    const { take, skip } = getORMSkipAndTake(pagination);
    const queryBuilder = this.createQueryBuilder('knowledge_area')
      .leftJoinAndSelect('knowledge_area.competencies', 'competencies')
      .take(take)
      .skip(skip);
    return queryBuilder.getManyAndCount();
  }

  findManyByUIDS(uids: string[]) {
    return this.createQueryBuilder('knowledge_area')
      .leftJoinAndSelect('knowledge_area.competencies', 'competency')
      .where(`lower(knowledge_area.uid) IN (:...uids)`, {
        uids: uids.map((uid) => uid.toLowerCase()),
      })
      .getMany();
  }

  async findManyByIds(ids: number[]): Promise<KnowledgeArea[]> {
    return this.findBy({
      id: In(ids),
    });
  }
  async getKnowledgeAreasByEvaluationRolePaginated(
    pagination: PaginationDto,
    evaluationRoleName: string,
  ): Promise<[KnowledgeArea[], number]> {
    const { take, skip } = getORMSkipAndTake(pagination);
    const knowledgeAreas = await this.findAndCount({
      relations: ['competencies'],
      where: {
        competencies: { evaluationRoles: { name: evaluationRoleName } },
      },
      take,
      skip,
    });
    return knowledgeAreas;
  }
}
