import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser, AuthorizedRoles, User } from '@Auth/decorators';
import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';
import { ApiPaginatedResponse, ApiSingleResponse } from '@Core/decorators';
import {
  IdParamDto,
  MultipleResponse,
  PaginationDto,
  SingleResponse,
} from '@Core/dto';
import { serializeMultipleResponse, serializeResponse } from '@Core/utils';
import { UserRole } from '@Role/enums';

import { SkillService } from '../services';
import { SkillDto, UpdateSkillDto } from '../dtos';
import { SkillDoc } from '../docs';

@ApiTags('Skills management endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @ApiSingleResponse(SkillDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve a skill by id',
    summary: 'Get a skill',
  })
  @Get(':id')
  async getSkill(@Param() id: IdParamDto): Promise<SingleResponse<SkillDoc>> {
    const skill = await this.skillService.findOneById(id.id);
    return serializeResponse(SkillDoc, skill);
  }

  @ApiPaginatedResponse(SkillDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve the skills',
    summary: 'Get skills',
  })
  @Get()
  async getSkills(
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponse<SkillDoc[]>> {
    const [skills, total] = await this.skillService.findAll(pagination);
    return serializeMultipleResponse(SkillDoc, skills, pagination, total);
  }

  @ApiSingleResponse(SkillDoc)
  @ApiOperation({
    description: 'Use this endpoint to disable a skill by a given id',
    summary: 'Disable a skill',
  })
  @Delete(':id')
  async disableSkill(
    @Param() id: IdParamDto,
  ): Promise<SingleResponse<SkillDoc>> {
    const skill = await this.skillService.disableOne(id.id);
    return serializeResponse(SkillDoc, skill);
  }

  @ApiSingleResponse(SkillDoc)
  @ApiOperation({
    description: 'Use this endpoint to create a skill',
    summary: 'Create a skill',
  })
  @Post()
  async createSkill(
    @Body() skillDto: SkillDto,
  ): Promise<SingleResponse<SkillDoc>> {
    const knowledgeArea = await this.skillService.createOne(skillDto);
    return serializeResponse(SkillDoc, knowledgeArea);
  }

  @ApiSingleResponse(SkillDoc)
  @ApiOperation({
    description: 'Use this endpoint to update a skill',
    summary: 'Update skills',
  })
  @Patch(':id')
  async update(
    @Param() id: IdParamDto,
    @Body() updateSkillDto: UpdateSkillDto,
    @User() user: AuthUser,
  ): Promise<SingleResponse<SkillDoc>> {
    const updatedKnowledgeArea = await this.skillService.updateOne(
      id.id,
      updateSkillDto,
      user.sub,
    );
    return serializeResponse(SkillDoc, updatedKnowledgeArea);
  }
}
