import { Test, TestingModule } from '@nestjs/testing';

import { ProviderMock } from '@Common/types';
import { QuestionService } from '@Question/services';
import { question } from '@Question/tests/mocks/data';

import { optionServiceTestingModuleConfig } from './config/';
import {
  correctAnswerPolymorphism,
  createCorrectPolymorphismAnswerDto,
} from './mocks/data';
import { OptionRepositoryMock } from './mocks/repositories';
import { OptionRepository } from '../repositories';
import { OptionService } from '../services/option.service';

describe('OptionService', () => {
  let service: OptionService;
  let questionService: QuestionService;
  let optionRepository: OptionRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      optionServiceTestingModuleConfig,
    ).compile();

    service = module.get<OptionService>(OptionService);
    questionService = module.get<QuestionService>(QuestionService);
    optionRepository =
      module.get<ProviderMock<OptionRepository>>(OptionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    describe('When a new option is created', () => {
      it('should return the option', async () => {
        jest.spyOn(questionService, 'findOne').mockResolvedValueOnce(question);
        optionRepository.save.mockResolvedValueOnce(correctAnswerPolymorphism);
        const result = service.create(createCorrectPolymorphismAnswerDto);
        await expect(result).resolves.toEqual(correctAnswerPolymorphism);
      });
    });
  });
});
