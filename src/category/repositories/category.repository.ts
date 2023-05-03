import { Repository } from 'typeorm';

import { CustomRepository } from '@Config/index';
import { PaginationDto } from '@Core/dto';
import { getORMSkipAndTake } from '@Core/utils';

import { Category } from '../entities';
@CustomRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async findAllPaginated(
    pagination: PaginationDto,
  ): Promise<[Category[], number]> {
    const { take, skip } = getORMSkipAndTake(pagination);
    return this.findAndCount({ relations: ['knowledgeAreas'], take, skip });
  }

  async findById(id: number): Promise<Category> {
    return this.findOne({ where: { id }, relations: ['knowledgeAreas'] });
  }
}
