import { getRepositoryToken } from '@nestjs/typeorm';

import { QuestionService } from '@Question/services';

import { OptionRepository } from '../../repositories';
import { OptionService } from '../../services';
import { OptionRepositoryValueMock } from '../../tests/mocks/repositories';

export const optionServiceTestingModuleConfig = {
  providers: [
    OptionService,
    {
      provide: QuestionService,
      useValue: {
        findOne: jest.fn(),
      },
    },
    {
      provide: getRepositoryToken(OptionRepository),
      useValue: OptionRepositoryValueMock(),
    },
  ],
};
