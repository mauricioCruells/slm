import { createMockRepository } from '@Common/tests';
import { AssessmentHistoryRepository } from '@AssessmentHistory/repositories';

export type AssessmentHistoryRepositoryMock = Partial<
  Record<keyof AssessmentHistoryRepository, jest.Mock>
>;

export const AssessmentHistoryRepositoryValueMock =
  (): AssessmentHistoryRepositoryMock => ({
    ...createMockRepository(),
    findByAssessmentId: jest.fn(),
  });
