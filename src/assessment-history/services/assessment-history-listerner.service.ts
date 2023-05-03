import { Injectable } from '@nestjs/common';

import { AssessmentHistoryAction } from '@AssessmentHistory/enums';
import { CompetencyRepository } from '@Competency/repositories';
import { AssessmentHistoryRepository } from '@AssessmentHistory/repositories';
import { KnowledgeAreaRepository } from '@Knowledge-Area/repositories';
import { SkillRepository } from '@Skill/repositories';
import { TopicRepository } from '@Topic/repositories';
import { QuestionRepository } from '@Question/repositories';

@Injectable()
export class AssessmentHistoryListenerService {
  constructor(
    private readonly assessmentHistoryRepository: AssessmentHistoryRepository,
    private readonly competencyRepository: CompetencyRepository,
    private readonly knowledgeAreaRepository: KnowledgeAreaRepository,
    private readonly skillRepository: SkillRepository,
    private readonly topicRepository: TopicRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async updateKnowledgeAreaLog(
    knowledgeAreaId: number,
    userId: number,
  ): Promise<void> {
    const assessmentIds =
      await this.knowledgeAreaRepository.findAssessmentIdsByKnowledgeAreaId(
        knowledgeAreaId,
      );

    if (!assessmentIds.length) {
      return;
    }

    await this.assessmentHistoryRepository.saveLogs(
      assessmentIds,
      AssessmentHistoryAction.Modified,
      userId,
    );
  }

  async updateCompetencyLog(
    competencyId: number,
    userId: number,
  ): Promise<void> {
    const assessmentIds =
      await this.competencyRepository.findAssessmentIdsByCompetencyId(
        competencyId,
      );

    if (!assessmentIds.length) {
      return;
    }

    await this.assessmentHistoryRepository.saveLogs(
      assessmentIds,
      AssessmentHistoryAction.Modified,
      userId,
    );
  }

  async updateSkillLog(skillId: number, userId: number): Promise<void> {
    const assessmentIds = await this.skillRepository.findAssessmentIdsBySkillId(
      skillId,
    );

    if (!assessmentIds.length) {
      return;
    }

    await this.assessmentHistoryRepository.saveLogs(
      assessmentIds,
      AssessmentHistoryAction.Modified,
      userId,
    );
  }

  async updateTopicLog(topicId: number, userId: number): Promise<void> {
    const assessmentIds = await this.topicRepository.findAssessmentIdsByTopicId(
      topicId,
    );

    if (!assessmentIds.length) {
      return;
    }

    await this.assessmentHistoryRepository.saveLogs(
      assessmentIds,
      AssessmentHistoryAction.Modified,
      userId,
    );
  }

  async updateQuestionLog(questionId: number, userId: number): Promise<void> {
    const assessmentIds =
      await this.questionRepository.findAssessmentIdsByQuestionId(questionId);

    if (!assessmentIds.length) {
      return;
    }

    await this.assessmentHistoryRepository.saveLogs(
      assessmentIds,
      AssessmentHistoryAction.Modified,
      userId,
    );
  }
}
