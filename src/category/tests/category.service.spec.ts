import { Test, TestingModule } from '@nestjs/testing';

import { ProviderMock } from '@Common/types';
import { CategoryRepository } from '@Category/repositories';

import { CategoryService } from '../services';
import { categoryServiceTestingModuleConfig } from './config';
import { categoryMock } from './mocks/data';
import { CategoryRepositoryMock } from './mocks/repositories';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: CategoryRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      categoryServiceTestingModuleConfig,
    ).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository =
      module.get<ProviderMock<CategoryRepository>>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe('findAll', () => {
    describe('When all categories are requested', () => {
      it('should return a list of categories', async () => {
        categoryRepository.find.mockResolvedValueOnce([categoryMock]);
        const result = service.findAll();
        await expect(result).resolves.toEqual([categoryMock]);
      });
    });
  });
});
