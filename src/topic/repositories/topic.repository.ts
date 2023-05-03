import { In, Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { FilterDto, PaginationDto } from '@Core/dto';
import { getORMSkipAndTake } from '@Core/utils';
import { AssessmentIdRaw } from '@AssessmentHistory/interfaces';

import { Topic } from '../entities';
import { TopicWhereFilter } from '../dto';

@CustomRepository(Topic)
export class TopicRepository extends Repository<Topic> {
  async findAssessmentIdsByTopicId(id: number): Promise<number[]> {
    const assessmentIdsRaw = (await this.createQueryBuilder('topic')
      .select('assessment.id')
      .leftJoin('topic.skill', 'skill')
      .leftJoin('skill.competency', 'competency')
      .leftJoin('competency.knowledgeArea', 'knowledgeArea')
      .leftJoin('knowledgeArea.assessments', 'assessment')
      .where('topic.id = :id', { id })
      .getRawMany()) as AssessmentIdRaw[];

    return assessmentIdsRaw
      .filter((assessment) => typeof assessment.assessment_id === 'number')
      .map((assessment) => assessment.assessment_id);
  }

  findManyBy(filter: FilterDto<TopicWhereFilter>): Promise<Topic[]> {
    return this.createQueryBuilder('topic').where(filter.where).getMany();
  }

  findManyByUIDs(uids: string[]): Promise<Topic[]> {
    return this.findManyBy({
      where: { uid: In(uids) },
      relations: ['skill'],
    });
  }

  findManyByNames(names: string[]): Promise<Topic[]> {
    return this.findManyBy({
      where: { name: In(names) },
      relations: ['skill'],
    });
  }

  findByIds(ids: number[]): Promise<Topic[]> {
    return this.find({
      where: {
        id: In(ids),
      },
      relations: ['skill'],
    });
  }

  findOneTopicById(id: number): Promise<Topic> {
    return this.findOne({
      where: { id },
      relations: ['skill', 'questions', 'questions.level'],
    });
  }

  findAll(pagination: PaginationDto): Promise<[Topic[], number]> {
    const { take, skip } = getORMSkipAndTake(pagination);
    return this.findAndCount({
      relations: ['skill'],
      skip,
      take,
    });
  }

  findOneByUid(uid: string): Promise<Topic> {
    return this.findOne({ where: { uid } });
  }
}
