import { createMock } from '@golevelup/ts-jest';

import { Category } from '../../../entities';

export const categoryMock: Category = createMock<Category>({
  id: 0,
  name: 'Category 1',
  description: 'Category 1 description',
  createdAt: new Date(),
  updatedAt: new Date(),
});
