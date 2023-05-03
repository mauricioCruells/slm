import { Injectable, NotFoundException } from '@nestjs/common';

import { PaginationDto } from '@Core/dto';
import { notFoundByIdMessage } from '@Core/utils';
import { KnowledgeAreaService } from '@Knowledge-Area/services';

import { Category } from '../entities';
import { CategoryRepository } from '../repositories';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly knowledgeAreaService: KnowledgeAreaService,
  ) {}

  async findAll(pagination: PaginationDto): Promise<[Category[], number]> {
    return this.categoryRepository.findAllPaginated(pagination);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(notFoundByIdMessage('Category', id));
    }

    return category;
  }

  async addKnowledgeAreas(
    categoryId: number,
    knowledgeAreaIds: number[],
  ): Promise<Category> {
    const knowledgeAreasToAdd = await this.knowledgeAreaService.findManyById(
      knowledgeAreaIds,
    );

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException(notFoundByIdMessage('Category', categoryId));
    }

    for (const knowledgeArea of knowledgeAreasToAdd) {
      const knowledgeAreaInCategory = category.knowledgeAreas.some(
        (ka) => ka.id === knowledgeArea.id,
      );

      if (!knowledgeAreaInCategory) {
        category.knowledgeAreas.push(knowledgeArea);
      }
    }

    await this.categoryRepository.save(category);

    return category;
  }
}
