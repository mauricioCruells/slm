import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SeniorityLevelService } from '@Seniority-Level/services';
import { TopicService } from '@Topic/services';
import { UserService } from '@User/services';

import { QuestionRepositoryValueMock } from '../mocks/repositories/';
import { QuestionRepository } from '../../repositories';
import { QuestionService } from '../../services';

export const questionServiceTestingModuleConfig = {
  providers: [
    QuestionService,
    {
      provide: getRepositoryToken(QuestionRepository),
      useValue: QuestionRepositoryValueMock(),
    },
    {
      provide: UserService,
      useValue: {
        findOneById: jest.fn(),
      },
    },
    {
      provide: SeniorityLevelService,
      useValue: {
        findOneById: jest.fn(),
      },
    },
    {
      provide: TopicService,
      useValue: {
        findOneById: jest.fn(),
      },
    },
    {
      provide: EventEmitter2,
      useValue: {
        emmitAsync: jest.fn(),
      },
    },
  ],
};
