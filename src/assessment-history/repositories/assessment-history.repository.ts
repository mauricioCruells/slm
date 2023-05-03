import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { AssessmentHistory } from '@AssessmentHistory/entities';
import { AssessmentHistoryAction } from '@AssessmentHistory/enums';

@CustomRepository(AssessmentHistory)
export class AssessmentHistoryRepository extends Repository<AssessmentHistory> {
  async saveLogs(
    assessmentIds: number[],
    action: AssessmentHistoryAction,
    userId: number,
  ): Promise<void> {
    const assessmentHistoryLogs = assessmentIds.map((assessmentId) => {
      return this.create({
        assessment: { id: assessmentId },
        action,
        date: new Date(),
        executedBy: { id: userId },
      });
    });

    await this.insert(assessmentHistoryLogs);
  }

  findByAssessmentId(assessmentId: number): Promise<AssessmentHistory[]> {
    return this.find({
      where: { assessment: { id: assessmentId } },
      relations: ['executedBy'],
    });
  }
}
