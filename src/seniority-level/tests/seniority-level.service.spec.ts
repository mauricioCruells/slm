import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { ProviderMock } from '@Common/types';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SeniorityLevelService } from '../services';
import { SeniorityLevelRepository } from '../repositories';
import { SeniorityLevel } from '../entities';
import { seniorityLevelServiceTestingModuleConfig } from './config';
import { SeniorityLevelRepositoryMock } from './mocks/repositories';

describe('SeniorityLevelService', () => {
  let service: SeniorityLevelService;
  let seniorityLevelRepository: SeniorityLevelRepositoryMock;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      seniorityLevelServiceTestingModuleConfig,
    ).compile();

    service = module.get<SeniorityLevelService>(SeniorityLevelService);
    seniorityLevelRepository = module.get<
      ProviderMock<SeniorityLevelRepository>
    >(getRepositoryToken(SeniorityLevelRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    describe('When all seniority level are asked', () => {
      it('should return the seniority levels', async () => {
        const seniorityLevelMock = createMock<SeniorityLevel>();
        seniorityLevelRepository.find.mockResolvedValueOnce([
          seniorityLevelMock,
        ]);
        const result = service.findAll();
        await expect(result).resolves.toEqual([seniorityLevelMock]);
      });
    });
  });
  describe('findOneById', () => {
    describe(`when id doesn't exist`, () => {
      it('should throw a NotFoundException', async () => {
        seniorityLevelRepository.findOneSLById.mockResolvedValueOnce(null);
        try {
          await service.findOneById(1);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
    describe('otherwhise', () => {
      it('should return a seniorityLevel', async () => {
        const seniorityLevelMock = createMock<SeniorityLevel>();
        seniorityLevelRepository.findOneSLById.mockResolvedValueOnce(
          seniorityLevelMock,
        );
        const result = await service.findOneById(1);
        expect(result).toEqual(seniorityLevelMock);
      });
    });
  });
});
