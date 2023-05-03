import { createMockRepository } from '@Common/tests';
import { CategoryRepository } from '@Category/repositories';

export type CategoryRepositoryMock = Partial<
  Record<keyof CategoryRepository, jest.Mock>
>;

export const CategoryRepositoryValueMock = (): CategoryRepositoryMock => ({
  ...createMockRepository(),
});
