import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterDto, WhereNameFilter } from '@Core/dto';
import { notFoundByIdMessage } from '@Core/utils';

import { SeniorityLevel } from '../entities';
import { SeniorityLevelRepository } from '../repositories';

@Injectable()
export class SeniorityLevelService {
  constructor(
    private readonly seniorityLevelRepository: SeniorityLevelRepository,
  ) {}

  findByFilters(filter: FilterDto<WhereNameFilter>): Promise<SeniorityLevel[]> {
    return this.seniorityLevelRepository.getByFilters(filter);
  }

  async findOneById(id: number): Promise<SeniorityLevel> {
    const seniorityLevel = await this.seniorityLevelRepository.findOneSLById(
      id,
    );

    if (!seniorityLevel)
      throw new NotFoundException(notFoundByIdMessage('Seniority level', id));

    return seniorityLevel;
  }

  async findAll(): Promise<SeniorityLevel[]> {
    return this.seniorityLevelRepository.find();
  }
}
