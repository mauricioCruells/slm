import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthorizedRoles, AuthUser, User } from '@Auth/decorators';
import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';
import {
  ApiArrayResponse,
  ApiPaginatedResponse,
  ApiSingleResponse,
} from '@Core/decorators';
import {
  IdParamDto,
  MultipleResponse,
  PaginationDto,
  SingleResponse,
} from '@Core/dto';
import {
  csvFileFilter,
  serializeMultipleResponse,
  serializeResponse,
} from '@Core/utils';
import { UserRole } from '@Role/enums';

import { CompetencyFileDetailsDoc } from '../docs';
import { CompetencyService } from '../services';
import { CompetencyDoc } from '../docs';
import { CompetencyDto, UpdateCompetencyDto } from '../dtos';

@ApiTags('Competencies management endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('competencies')
export class CompetencyController {
  constructor(private readonly competencyService: CompetencyService) {}

  @ApiSingleResponse(CompetencyDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve a competency by id',
    summary: 'Get a competency',
  })
  @Get(':id')
  async getCompetency(
    @Param() id: IdParamDto,
  ): Promise<SingleResponse<CompetencyDoc>> {
    const competency = await this.competencyService.findOneById(id.id);
    return serializeResponse(CompetencyDoc, competency);
  }

  @ApiPaginatedResponse(CompetencyDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve the competencies',
    summary: 'Get competencies',
  })
  @Get()
  async getCompetencies(
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponse<CompetencyDoc[]>> {
    const [competencies, total] = await this.competencyService.findAll(
      pagination,
    );
    return serializeMultipleResponse(
      CompetencyDoc,
      competencies,
      pagination,
      total,
    );
  }

  @ApiSingleResponse(CompetencyDoc, 201)
  @ApiOperation({
    description: 'Use this endpoint to create a competency',
    summary: 'Create a competency',
  })
  @Post()
  async createCompetency(
    @Body() competencyDto: CompetencyDto,
    @User() user: AuthUser,
  ): Promise<SingleResponse<CompetencyDoc>> {
    const competency = await this.competencyService.createOne(
      competencyDto,
      user.sub,
    );
    return serializeResponse(CompetencyDoc, competency);
  }

  @ApiSingleResponse(CompetencyDoc)
  @ApiOperation({
    description: 'Use this endpoint to update a competency',
    summary: 'Update competencies',
  })
  @Patch(':id')
  async update(
    @Param() id: IdParamDto,
    @Body() updateCompetencyDto: UpdateCompetencyDto,
    @User() user: AuthUser,
  ): Promise<SingleResponse<CompetencyDoc>> {
    const updatedKnowledgeArea = await this.competencyService.updateOne(
      id.id,
      updateCompetencyDto,
      user.sub,
    );
    return serializeResponse(CompetencyDoc, updatedKnowledgeArea);
  }

  @ApiOperation({
    description: 'Use this endpoint to upload a file of competencies',
    summary: 'Upload a file competencies',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiArrayResponse(CompetencyFileDetailsDoc)
  @UseInterceptors(FileInterceptor('file', { fileFilter: csvFileFilter }))
  @Post('upload-file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: AuthUser,
  ): Promise<MultipleResponse<CompetencyFileDetailsDoc[]>> {
    if (!file)
      throw new BadRequestException('File not detected in the request.');

    const details = await this.competencyService.uploadFileAndSave(
      file,
      user.sub,
    );
    return serializeMultipleResponse(CompetencyFileDetailsDoc, details);
  }

  @ApiSingleResponse(CompetencyDoc)
  @ApiOperation({
    description: 'Use this endpoint to disable a competency by a given id',
    summary: 'Disable a competency',
  })
  @Delete(':id')
  async disableCompetency(
    @Param() id: IdParamDto,
  ): Promise<SingleResponse<CompetencyDoc>> {
    const competency = await this.competencyService.disableOne(id.id);
    return serializeResponse(CompetencyDoc, competency);
  }
}
