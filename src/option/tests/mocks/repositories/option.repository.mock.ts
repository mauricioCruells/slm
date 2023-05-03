import { createMockRepository } from '@Common/tests';

import { OptionRepository } from '@Option/repositories';

export type OptionRepositoryMock = Partial<
  Record<keyof OptionRepository, jest.Mock>
>;

export const OptionRepositoryValueMock = (): OptionRepositoryMock => ({
  ...createMockRepository(),
});
