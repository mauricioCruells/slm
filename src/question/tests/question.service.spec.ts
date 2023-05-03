import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ProviderMock } from '@Common/types';
import { SeniorityLevelService } from '@Seniority-Level/services';
import { levelOne } from '@Seniority-Level/tests/mocks';
import { TopicService } from '@Topic/services';
import { oop } from '@Topic/tests/mocks';
import { UserService } from '@User/services';
import {
  interviewerDataMock,
  loggedInterviewerInformationDtoMock,
} from '@User/tests/mocks/data';

import { questionServiceTestingModuleConfig } from './config';
import { createQuestionDtoDataMock, question } from './mocks/data';
import { QuestionRepositoryMock } from './mocks/repositories';
import { QuestionRepository } from '../repositories';
import { QuestionService } from '../services/';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: QuestionRepositoryMock;
  let userService: UserService;
  let seniorityLevelService: SeniorityLevelService;
  let topicService: TopicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      questionServiceTestingModuleConfig,
    ).compile();

    service = module.get<QuestionService>(QuestionService);
    userService = module.get<UserService>(UserService);
    seniorityLevelService = module.get<SeniorityLevelService>(
      SeniorityLevelService,
    );
    topicService = module.get<TopicService>(TopicService);
    questionRepository =
      module.get<ProviderMock<QuestionRepository>>(QuestionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    describe('When all question are requested', () => {
      it('should return a list of questions', async () => {
        questionRepository.findAll.mockResolvedValueOnce([question]);
        const result = service.findAll({});
        await expect(result).resolves.toEqual([question]);
      });
    });
  });

  describe('findOne', () => {
    describe('When a question is asked by id and found', () => {
      it('should return a question', async () => {
        const id = 1;
        questionRepository.getOneById.mockResolvedValue(question);
        const result = service.findOne(id);
        await expect(result).resolves.toEqual(question);
      });
    });

    describe('When a question is not found', () => {
      it('should throw a Not Found Exception', async () => {
        const id = 1;
        questionRepository.getOneById.mockResolvedValue(undefined);
        const result = service.findOne(id);
        await expect(result).rejects.toThrow(
          new NotFoundException(`Question with ID ${id} was not found`),
        );
      });
    });
  });

  describe('create', () => {
    describe('When a new question is created', () => {
      it('should return the question', async () => {
        jest
          .spyOn(userService, 'findOneById')
          .mockResolvedValueOnce(interviewerDataMock);
        jest
          .spyOn(seniorityLevelService, 'findOneById')
          .mockResolvedValueOnce(levelOne);
        jest.spyOn(topicService, 'findOneById').mockResolvedValueOnce(oop);
        questionRepository.save.mockResolvedValueOnce(question);
        const result = service.create(
          createQuestionDtoDataMock,
          loggedInterviewerInformationDtoMock,
        );
        await expect(result).resolves.toEqual(question);
      });
    });
  });
});
