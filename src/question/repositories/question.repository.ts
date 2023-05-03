import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { PaginationDto } from '@Core/dto';
import { getORMSkipAndTake } from '@Core/utils';
import { AssessmentIdRaw } from '@AssessmentHistory/interfaces';

import { Question } from '../entities';

@CustomRepository(Question)
export class QuestionRepository extends Repository<Question> {
  async findAssessmentIdsByQuestionId(id: number): Promise<number[]> {
    const assessmentIdsRaw = (await this.createQueryBuilder('question')
      .select('assessment.id')
      .leftJoin('question.topic', 'topic')
      .leftJoin('topic.skill', 'skill')
      .leftJoin('skill.competency', 'competency')
      .leftJoin('competency.knowledgeArea', 'knowledgeArea')
      .leftJoin('knowledgeArea.assessments', 'assessment')
      .where('question.id = :id', { id })
      .getRawMany()) as AssessmentIdRaw[];

    return assessmentIdsRaw
      .filter((assessment) => typeof assessment.assessment_id === 'number')
      .map((assessment) => assessment.assessment_id);
  }

  async findAll(pagination: PaginationDto): Promise<[Question[], number]> {
    const { take, skip } = getORMSkipAndTake(pagination);
    const questions = await this.findAndCount({
      relations: ['options', 'level', 'author', 'topic'],
      take,
      skip,
    });
    return questions;
  }

  async getOneById(id: number): Promise<Question> {
    const question = await this.findOne({
      where: { id },
      relations: ['options', 'level', 'author', 'topic'],
    });
    return question;
  }

  async disableQuestion(id: number): Promise<Question> {
    const question = await this.getOneById(id);
    return await this.save({ ...question, isActive: false });
  }

  findManyQuestions(questions: string[]) {
    return this.createQueryBuilder('question')
      .leftJoinAndSelect('question.topic', 'topic')
      .where(`lower(question.question) IN (:...questions)`, {
        questions: questions.map((question) => question.toLowerCase()),
      })
      .getMany();
  }
}
