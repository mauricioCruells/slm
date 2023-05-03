import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AssessmentHistoryListenerService } from '../services';

@Injectable()
export class AssessmentHistoryListener {
  constructor(
    private readonly assessmentHistoryService: AssessmentHistoryListenerService,
  ) {}

  @OnEvent('assessmentHistory.knowledgeArea.update')
  handleUpdateKnowledgeAreaLog(knowledgeAreaId: number, userId: number): void {
    this.assessmentHistoryService.updateKnowledgeAreaLog(
      knowledgeAreaId,
      userId,
    );
  }

  @OnEvent('assessmentHistory.competency.update')
  handleUpdateCompetencyLog(competencyId: number, userId: number): void {
    this.assessmentHistoryService.updateCompetencyLog(competencyId, userId);
  }

  @OnEvent('assessmentHistory.skill.update')
  handleUpdateSkillLog(skillId: number, userId: number): void {
    this.assessmentHistoryService.updateSkillLog(skillId, userId);
  }

  @OnEvent('assessmentHistory.topic.update')
  handleUpdateTopicLog(topicId: number, userId: number): void {
    this.assessmentHistoryService.updateTopicLog(topicId, userId);
  }

  @OnEvent('assessmentHistory.question.update')
  handleUpdateQuestionLog(questionId: number, userId: number): void {
    this.assessmentHistoryService.updateQuestionLog(questionId, userId);
  }
}
