import { createMockRepository } from '@Common/tests';

import { QuestionRepository } from '@Question/repositories';

export type QuestionRepositoryMock = Partial<
  Record<keyof QuestionRepository, jest.Mock>
>;

export const QuestionRepositoryValueMock = (): QuestionRepositoryMock => ({
  ...createMockRepository(),
  findAll: jest.fn(),
  getOneById: jest.fn(),
});
