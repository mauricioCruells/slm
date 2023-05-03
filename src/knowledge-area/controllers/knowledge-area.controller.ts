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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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
  NameDto,
  PaginationDto,
  SingleResponse,
} from '@Core/dto';
import {
  csvFileFilter,
  serializeMultipleResponse,
  serializeResponse,
} from '@Core/utils';
import { UserRole } from '@Role/enums';

import { KnowledgeAreaService } from '../services';
import { KnowledgeAreaDto, UpdateKnowledgeAreaDto } from '../dtos';
import { KnowledgeAreaDoc, KnowledgeAreaFileDetailsDoc } from '../docs';

@ApiTags('Knowledge Areas management endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@Controller('knowledge-areas')
export class KnowledgeAreaController {
  constructor(private readonly knowledgeAreaService: KnowledgeAreaService) {}

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiArrayResponse(KnowledgeAreaDoc)
  @ApiOperation({
    description: 'Use this endpoint to find knowledge areas by a given name',
    summary: 'Get knowledge areas by name',
  })
  @Get('/search')
  async findKnowledgeAreaByName(
    @Query() nameDto: NameDto,
  ): Promise<MultipleResponse<KnowledgeAreaDoc[]>> {
    const knowledgeAreas = await this.knowledgeAreaService.findByName(
      nameDto.name,
    );

    return serializeMultipleResponse(KnowledgeAreaDoc, knowledgeAreas);
  }

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiSingleResponse(KnowledgeAreaDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve a knowledge area by id',
    summary: 'Get a knowledge area',
  })
  @Get(':id')
  async getKnowledgeArea(
    @Param() id: IdParamDto,
  ): Promise<SingleResponse<KnowledgeAreaDoc>> {
    const knowledgeArea = await this.knowledgeAreaService.findOneById(id.id);
    return serializeResponse(KnowledgeAreaDoc, knowledgeArea);
  }

  @AuthorizedRoles(UserRole.ALL)
  @ApiPaginatedResponse(KnowledgeAreaDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve knowledge areas paginated',
    summary: 'Get knowledge areas',
  })
  @Get()
  async findAllPaginated(
    @Query() pagination: PaginationDto,
    @User() loggedUser: AuthUser,
  ): Promise<MultipleResponse<KnowledgeAreaDoc[]>> {
    const [knowledgeAreas, total] =
      await this.knowledgeAreaService.findAllPaginated(pagination, loggedUser);
    return serializeMultipleResponse(
      KnowledgeAreaDoc,
      knowledgeAreas,
      pagination,
      total,
    );
  }

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiSingleResponse(KnowledgeAreaDoc)
  @ApiOperation({
    description: 'Use this endpoint to disable a knowledge area by a given id',
    summary: 'Disable a knowledge area',
  })
  @Delete(':id')
  async disableKnowledgeArea(@Param() id: IdParamDto): Promise<void> {
    await this.knowledgeAreaService.disableOne(id.id);
  }

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiSingleResponse(KnowledgeAreaDoc)
  @ApiOperation({
    description: 'Use this endpoint to create a knowledge area',
    summary: 'Create a knowledge area',
  })
  @Post()
  async createKnowledgeArea(
    @Body() knowledgeAreaDto: KnowledgeAreaDto,
  ): Promise<SingleResponse<KnowledgeAreaDoc>> {
    const knowledgeArea = await this.knowledgeAreaService.createOne(
      knowledgeAreaDto,
    );
    return serializeResponse(KnowledgeAreaDoc, knowledgeArea);
  }

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiSingleResponse(KnowledgeAreaDoc)
  @ApiOperation({
    description: 'Use this endpoint to update a knowledge area',
    summary: 'Update knowledge areas',
  })
  @Patch(':id')
  async update(
    @Param() id: IdParamDto,
    @Body() updateKnowledgeAreaDto: UpdateKnowledgeAreaDto,
    @User() loggedUser: AuthUser,
  ): Promise<SingleResponse<KnowledgeAreaDoc>> {
    const updatedKnowledgeArea = await this.knowledgeAreaService.updateOne(
      id.id,
      updateKnowledgeAreaDto,
      loggedUser.sub,
    );
    return serializeResponse(KnowledgeAreaDoc, updatedKnowledgeArea);
  }

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiOperation({
    description: 'Use this endpoint to upload a file of knowledge areas',
    summary: 'Upload a file of knowledge areas',
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
  @ApiArrayResponse(KnowledgeAreaFileDetailsDoc)
  @UseInterceptors(FileInterceptor('file', { fileFilter: csvFileFilter }))
  @Post('upload-file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MultipleResponse<KnowledgeAreaFileDetailsDoc[]>> {
    if (!file)
      throw new BadRequestException('File not detected in the request.');

    const details = await this.knowledgeAreaService.uploadFileAndSave(file);
    return serializeMultipleResponse(KnowledgeAreaFileDetailsDoc, details);
  }
}
