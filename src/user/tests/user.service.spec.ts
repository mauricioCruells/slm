import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProviderMock } from '@Common/types';
import { EvaluationRoleService } from '@Evaluation-Role/services';
import { RoleService } from '@Role/services';
import { SeniorityLevelService } from '@Seniority-Level/services';
import { UserRepository } from '@User/repositories';
import { userServiceTestingModuleConfig } from '@User/tests/config';
import {
  intervieweeDataMock,
  authUserMock,
  paginationDtoMock,
  paginatedUsers,
} from './mocks/data';
import { UserRepositoryMock } from './mocks/repositories';
import { UserService } from '../services/user.service';

describe('UserService', () => {
  let service: UserService;
  // eslint-disable-next-line
  let roleService: RoleService;
  // eslint-disable-next-line
  let seniorityLevelService: SeniorityLevelService;
  // eslint-disable-next-line
  let evaluationRoleService: EvaluationRoleService;
  let userRepository: UserRepositoryMock;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      userServiceTestingModuleConfig,
    ).compile();

    service = module.get<UserService>(UserService);
    roleService = module.get<RoleService>(RoleService);
    seniorityLevelService = module.get<SeniorityLevelService>(
      SeniorityLevelService,
    );
    evaluationRoleService = module.get<EvaluationRoleService>(
      EvaluationRoleService,
    );
    userRepository = module.get<ProviderMock<UserRepository>>(
      getRepositoryToken(UserRepository),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    describe('When all users are asked', () => {
      it('should return the users and the number of users', async () => {
        userRepository.getAllUsers.mockResolvedValueOnce(paginatedUsers);
        const result = service.findAll(paginationDtoMock);
        await expect(result).resolves.toEqual(paginatedUsers);
      });
    });
  });

  describe('findOneById', () => {
    describe('When it contains logged user information from an interviewee', () => {
      it('should throw a 403 Forbidden Exception', async () => {
        userRepository.getOneById.mockResolvedValueOnce(intervieweeDataMock);
        userRepository.getOneById.mockResolvedValueOnce(intervieweeDataMock);
        const result = service.findOneById(4, authUserMock);
        await expect(result).rejects.toThrow(
          new ForbiddenException('You do not have enough privileges'),
        );
      });
    });

    describe('When the user is not found', () => {
      it('should throw a Not Found Exception', async () => {
        const id = 4;
        userRepository.getOneById.mockResolvedValueOnce(undefined);
        const result = service.findOneById(id);
        await expect(result).rejects.toThrow(
          new NotFoundException(`User with ID ${id} was not found`),
        );
      });
    });

    describe('When all the conditions are passed', () => {
      it('should return the user information', async () => {
        const id = 1;
        userRepository.getOneById.mockResolvedValueOnce(intervieweeDataMock);
        const result = service.findOneById(id);
        await expect(result).resolves.toEqual(intervieweeDataMock);
      });
    });
  });
});
