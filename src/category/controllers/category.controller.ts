import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthorizedRoles } from '@Auth/decorators';
import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';
import {
  ApiArrayResponse,
  ApiSingleResponse,
  ExcludeWhenNotDev,
} from '@Core/decorators';
import { serializeMultipleResponse, serializeResponse } from '@Core/utils';
import {
  IdParamDto,
  MultipleResponse,
  PaginationDto,
  SingleResponse,
} from '@Core/dto';
import { UserRole } from '@Role/enums';

import { CategoryService } from '../services';
import { CategoryDoc } from '../docs';
import { KnowledgeAreaIdsDto } from '../dtos';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiTags('Category endpoints')
  @ApiArrayResponse(CategoryDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve all categories',
    summary: 'Get all categories',
  })
  @Get()
  async getAllCategories(
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponse<CategoryDoc[]>> {
    const [categories, total] = await this.categoryService.findAll(pagination);
    return serializeMultipleResponse(
      CategoryDoc,
      categories,
      pagination,
      total,
      false,
    );
  }

  @ApiTags('Category endpoints')
  @ApiSingleResponse(CategoryDoc)
  @ApiOperation({
    description: 'Use this endpoint to find a category by id',
    summary: 'Get one category by id',
  })
  @Get(':id')
  async getCategory(
    @Param() id: IdParamDto,
  ): Promise<SingleResponse<CategoryDoc>> {
    const category = await this.categoryService.findOne(id.id);
    return serializeResponse(CategoryDoc, category, false);
  }

  @ApiTags('Internal Endpoints')
  @Post('/:id/addKnowledgeAreas')
  @ExcludeWhenNotDev()
  async addKnowledgeAreaToCategory(
    @Param() id: IdParamDto,
    @Query() knowledgeArea: KnowledgeAreaIdsDto,
  ): Promise<SingleResponse<CategoryDoc>> {
    const category = await this.categoryService.addKnowledgeAreas(
      id.id,
      knowledgeArea.knowledgeAreas,
    );
    return serializeResponse(CategoryDoc, category);
  }
}
