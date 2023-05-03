import { createMockRepository } from '@Common/tests/';
import { UserRepository } from '@User/repositories';

export type UserRepositoryMock = Partial<
  Record<keyof UserRepository, jest.Mock>
>;

export const UserRepositoryValueMock = (): UserRepositoryMock => ({
  ...createMockRepository(),
  getOneById: jest.fn(),
  getAllUsers: jest.fn(),
});
