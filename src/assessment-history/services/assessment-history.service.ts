import { Injectable } from '@nestjs/common';

import { AssessmentHistoryRepository } from '@AssessmentHistory/repositories';
import { DATE_OPTIONS } from '@Core/utils';

@Injectable()
export class AssessmentHistoryService {
  constructor(
    private readonly assessmentHistoryRepository: AssessmentHistoryRepository,
  ) {}

  async findByAssessmentId(assessmentId: number): Promise<string[]> {
    const assessmentLogs =
      await this.assessmentHistoryRepository.findByAssessmentId(assessmentId);

    return assessmentLogs.map((assessmentLog) => {
      return `${assessmentLog.action} by ${
        assessmentLog.executedBy.firstName
      } ${assessmentLog.executedBy.lastName} on ${(
        assessmentLog.date as any
      ).toLocaleDateString('en-US', DATE_OPTIONS)}`;
    });
  }
}
