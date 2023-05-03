import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  MultipleResponse,
  PaginationDto,
  SingleResponse,
  IdParamDto,
} from '@Core/dto';
import { ApiPaginatedResponse, ApiSingleResponse } from '@Core/decorators';
import { serializeMultipleResponse, serializeResponse } from '@Core/utils';
import { AuthorizedRoles } from '@Auth/decorators';
import { UserRole } from '@Role/enums';
import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';

import { EvaluationRoleService } from '../services';
import { EvaluationRoleDoc } from '../docs';
import { EvaluationRoleDto, UpdateEvaluationRoleDto } from '../dto';

@ApiTags('Evaluation Roles management endpoints')
@ApiBearerAuth()
@UseGuards(JwtGuard, AccessTokenGuard, RoleGuard)
@Controller('evaluation-roles')
export class EvaluationRoleController {
  constructor(private readonly evaluationRoleService: EvaluationRoleService) {}

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiPaginatedResponse(EvaluationRoleDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve the evaluation roles paginated',
    summary: 'Get evaluation roles',
  })
  @Get()
  async findAllPaginated(
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponse<EvaluationRoleDoc[]>> {
    const [evaluationRoles, total] = await this.evaluationRoleService.findAll(
      pagination,
    );
    return serializeMultipleResponse(
      EvaluationRoleDoc,
      evaluationRoles,
      pagination,
      total,
    );
  }

  @AuthorizedRoles(UserRole.ADMIN)
  @ApiSingleResponse(EvaluationRoleDoc)
  @ApiOperation({
    description: 'Use this endpoint to create an evaluation role',
    summary: 'Create evaluation roles',
  })
  @Post()
  async createOne(
    @Body() evaluationRoleDto: EvaluationRoleDto,
  ): Promise<SingleResponse<EvaluationRoleDoc>> {
    const evaluationRole = await this.evaluationRoleService.create(
      evaluationRoleDto,
    );
    return serializeResponse(EvaluationRoleDoc, evaluationRole);
  }

  @AuthorizedRoles(UserRole.ADMIN)
  @ApiSingleResponse(EvaluationRoleDoc)
  @ApiOperation({
    description: 'Use this endpoint to update an evaluation role',
    summary: 'Update evaluation roles',
  })
  @Patch(':id')
  async update(
    @Param() paramId: IdParamDto,
    @Body() updateEvaluationRoleDto: UpdateEvaluationRoleDto,
  ): Promise<SingleResponse<EvaluationRoleDoc>> {
    const updatedEvaluationRole = await this.evaluationRoleService.update(
      paramId.id,
      updateEvaluationRoleDto,
    );
    return serializeResponse(EvaluationRoleDoc, updatedEvaluationRole);
  }

  @AuthorizedRoles(UserRole.ADMIN)
  @ApiNoContentResponse()
  @ApiOperation({
    description: 'Use this endpoint to delete an evaluation role',
    summary: 'Delete evaluation roles',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param() paramId: IdParamDto): Promise<void> {
    return await this.evaluationRoleService.delete(paramId.id);
  }
}
