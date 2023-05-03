import { createMockRepository } from '@Common/tests';
import { SeniorityLevelRepository } from '@Seniority-Level/repositories';

export type SeniorityLevelRepositoryMock = Partial<
  Record<keyof SeniorityLevelRepository, jest.Mock>
>;

export const SeniorityLevelRepositoryValueMock =
  (): SeniorityLevelRepositoryMock => ({
    ...createMockRepository(),
    getByFilters: jest.fn(),
    findOneSLById: jest.fn(),
  });
