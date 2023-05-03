import { Test, TestingModule } from '@nestjs/testing';

import { ProviderMock } from '@Common/types';
import { AssessmentHistoryRepository } from '@AssessmentHistory/repositories';
import { DATE_OPTIONS } from '@Core/utils';

import { AssessmentHistoryService } from '../services';
import { assessmentHistoryServiceTestingModuleConfig } from './config';
import { assessmentHistoryMock } from './mocks/data';
import { AssessmentHistoryRepositoryMock } from './mocks/repositories';

describe('AssessmentHistoryService', () => {
  let service: AssessmentHistoryService;
  let assessmentHistoryRepository: AssessmentHistoryRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      assessmentHistoryServiceTestingModuleConfig,
    ).compile();

    service = module.get<AssessmentHistoryService>(AssessmentHistoryService);
    assessmentHistoryRepository = module.get<
      ProviderMock<AssessmentHistoryRepository>
    >(AssessmentHistoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(assessmentHistoryRepository).toBeDefined();
  });

  const assessmentIdMock = 1;
  describe('findByAssessmentId', () => {
    it('should return a list of assessment history logs by assessment id', async () => {
      assessmentHistoryRepository.findByAssessmentId.mockResolvedValueOnce([
        assessmentHistoryMock,
      ]);
      const result = service.findByAssessmentId(assessmentIdMock);
      await expect(result).resolves.toEqual([
        `${assessmentHistoryMock.action} on ${(
          assessmentHistoryMock.date as any
        ).toLocaleDateString('en-US', DATE_OPTIONS)}`,
      ]);
    });
  });
});
