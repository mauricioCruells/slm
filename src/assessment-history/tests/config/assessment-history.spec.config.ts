import { getRepositoryToken } from '@nestjs/typeorm';

import { AssessmentHistoryRepository } from '@AssessmentHistory/repositories';
import { AssessmentHistoryService } from '@AssessmentHistory/services';

import { AssessmentHistoryRepositoryValueMock } from '../mocks/repositories';

export const assessmentHistoryServiceTestingModuleConfig = {
  providers: [
    AssessmentHistoryService,
    {
      provide: getRepositoryToken(AssessmentHistoryRepository),
      useValue: AssessmentHistoryRepositoryValueMock(),
    },
  ],
};
