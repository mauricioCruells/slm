import { SeniorityLevelRepository } from '@Seniority-Level/repositories';
import { SeniorityLevelService } from '@Seniority-Level/services';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SeniorityLevelRepositoryValueMock } from '../mocks/repositories';

export const seniorityLevelServiceTestingModuleConfig = {
  providers: [
    SeniorityLevelService,
    {
      provide: getRepositoryToken(SeniorityLevelRepository),
      useValue: SeniorityLevelRepositoryValueMock(),
    },
  ],
};
