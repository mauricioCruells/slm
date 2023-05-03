import { In, Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { FilterDto, PaginationDto } from '@Core/dto';
import { getORMSkipAndTake } from '@Core/utils';
import { AssessmentIdRaw } from '@AssessmentHistory/interfaces';

import { Skill } from '../entities';
import { SkillWhereFilter } from '../dtos';

@CustomRepository(Skill)
export class SkillRepository extends Repository<Skill> {
  async findAssessmentIdsBySkillId(id: number): Promise<number[]> {
    const assessmentIdsRaw = (await this.createQueryBuilder('skill')
      .select('assessment.id')
      .leftJoin('skill.competency', 'competency')
      .leftJoin('competency.knowledgeArea', 'knowledgeArea')
      .leftJoin('knowledgeArea.assessments', 'assessment')
      .where('skill.id = :id', { id })
      .getRawMany()) as AssessmentIdRaw[];

    return assessmentIdsRaw
      .filter((assessment) => typeof assessment.assessment_id === 'number')
      .map((assessment) => assessment.assessment_id);
  }

  findManyBy(filter: FilterDto<SkillWhereFilter>): Promise<Skill[]> {
    return this.createQueryBuilder('skill')
      .leftJoinAndSelect('skill.competency', 'competency')
      .where(filter.where)
      .getMany();
  }

  findManyByNames(skillNames: string[]) {
    return this.createQueryBuilder('skill')
      .leftJoinAndSelect('skill.competency', 'competency')
      .where(`lower(skill.name) IN (:...skillNames)`, {
        skillNames: skillNames.map((name) => name.toLowerCase()),
      })
      .getMany();
  }

  findManyByUIDs(skillUIDs: string[]) {
    return this.createQueryBuilder('skill')
      .leftJoinAndSelect('skill.competency', 'competency')
      .leftJoinAndSelect('skill.topics', 'topic')
      .where(`lower(skill.uid) IN (:...skillUIDs)`, {
        skillUIDs: skillUIDs.map((uid) => uid.toLowerCase()),
      })
      .getMany();
  }

  findByIds(ids: number[]): Promise<Skill[]> {
    return this.find({
      where: {
        id: In(ids),
      },
      relations: ['topics'],
    });
  }

  findOneSkillById(id: number): Promise<Skill> {
    return this.findOne({
      where: { id },
      relations: ['competency', 'topics'],
    });
  }

  findOneByUid(uid: string): Promise<Skill> {
    return this.findOne({ where: { uid } });
  }

  async findAll(pagination: PaginationDto): Promise<[Skill[], number]> {
    const { take, skip } = getORMSkipAndTake(pagination);
    return this.findAndCount({
      relations: ['topics'],
      take,
      skip,
    });
  }
}
