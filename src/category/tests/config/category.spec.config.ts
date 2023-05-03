import { getRepositoryToken } from '@nestjs/typeorm';

import { CategoryRepository } from '@Category/repositories';
import { CategoryService } from '@Category/services';

import { CategoryRepositoryValueMock } from '../mocks/repositories';

export const categoryServiceTestingModuleConfig = {
  providers: [
    CategoryService,
    {
      provide: getRepositoryToken(CategoryRepository),
      useValue: CategoryRepositoryValueMock(),
    },
  ],
};
