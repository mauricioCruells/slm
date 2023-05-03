import { Repository } from 'typeorm';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
  update: jest.fn(),
});
