import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthorizedRoles, AuthUser, User } from '@Auth/decorators';
import { JwtGuard, AccessTokenGuard, RoleGuard } from '@Auth/guards';
import { UserRole } from '@Role/enums';
import {
  csvFileFilter,
  serializeMultipleResponse,
  serializeResponse,
} from '@Core/utils';
import {
  IdParamDto,
  MultipleResponse,
  PaginationDto,
  SingleResponse,
} from '@Core/dto';
import {
  ApiArrayResponse,
  ApiPaginatedResponse,
  ApiSingleResponse,
} from '@Core/decorators';

import { QuestionResponseDoc, QuestionsFileDetailsDoc } from '../doc';
import { QuestionService } from '../services';
import { CreateQuestionDto } from '../dto';
import { UpdateQuestionDto } from '../dto';

@ApiTags('Question management endpoints')
@ApiBearerAuth()
@UseGuards(JwtGuard, AccessTokenGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({
    description: 'Retrieve an example file of questions',
    summary: 'Get example file of questions',
  })
  @ApiOkResponse({
    content: {
      'text/csv': {
        schema: { type: 'string' },
      },
    },
  })
  @Get('example-file')
  async getExampleFile(
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const file = await this.questionService.getExampleFile();

    res.attachment('SLM_questions.csv');
    res.set('Content-Type', 'text/csv');

    const csv = await file.Body.transformToString();
    return res.send(csv);
  }

  @ApiSingleResponse(QuestionResponseDoc)
  @ApiOperation({
    description: 'Use this endpoint to create a question',
    summary: 'Create questions',
  })
  @Post()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @User() authUser: AuthUser,
  ): Promise<SingleResponse<QuestionResponseDoc>> {
    const question = await this.questionService.create(
      createQuestionDto,
      authUser,
    );
    return serializeResponse(QuestionResponseDoc, question);
  }

  @ApiPaginatedResponse(QuestionResponseDoc)
  @ApiOperation({
    description: 'Use this endpoint to find all question',
    summary: 'get questions',
  })
  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponse<QuestionResponseDoc[]>> {
    const [questions, total] = await this.questionService.findAll(pagination);
    return serializeMultipleResponse(
      QuestionResponseDoc,
      questions,
      pagination,
      total,
    );
  }

  @ApiSingleResponse(QuestionResponseDoc)
  @ApiOperation({
    description: 'Use this endpoint to find a question',
    summary: 'Get a question',
  })
  @Get(':id')
  async findOne(
    @Param() id: IdParamDto,
  ): Promise<SingleResponse<QuestionResponseDoc>> {
    const question = await this.questionService.findOne(id.id);
    return serializeResponse(QuestionResponseDoc, question);
  }

  @ApiSingleResponse(QuestionResponseDoc)
  @ApiOperation({
    description: 'Use this endpoint to update a question',
    summary: 'Update questions',
  })
  @Patch(':id')
  async update(
    @Param() id: IdParamDto,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @User() user: AuthUser,
  ): Promise<SingleResponse<QuestionResponseDoc>> {
    const updateQuestion = await this.questionService.update(
      id.id,
      updateQuestionDto,
      user.sub,
    );
    return serializeResponse(QuestionResponseDoc, updateQuestion);
  }

  @ApiOperation({
    description: 'Use this endpoint to delete a question',
    summary: 'Delete questions',
  })
  @Delete(':id')
  async remove(@Param() id: IdParamDto): Promise<void> {
    await this.questionService.remove(id.id);
  }

  @ApiOperation({
    description:
      'Use this endpoint to upload a file of questions with their options and correct answers. The id param must be from the skill to which they will belong.',
    summary: 'Upload a file of questions',
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
  @ApiArrayResponse(QuestionsFileDetailsDoc)
  @UseInterceptors(FileInterceptor('file', { fileFilter: csvFileFilter }))
  @Post('upload-questions-file/:id')
  async uploadQuestonsFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: AuthUser,
    @Param() skillId: IdParamDto,
  ): Promise<MultipleResponse<QuestionsFileDetailsDoc[]>> {
    if (!file)
      throw new BadRequestException('File not detected in the request.');

    const details = await this.questionService.uploadQuestionsFile(
      file,
      user.sub,
      skillId.id,
    );
    return serializeMultipleResponse(QuestionsFileDetailsDoc, details);
  }

  @ApiOperation({
    description:
      'Use this endpoint to upload an image and link it to a question by id, image must be in jpg format',
    summary: 'Upload an image and link to question',
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
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async addImageToQuestion(
    @Param() id: IdParamDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image)
      throw new BadRequestException('Image not detected in the request.');

    const questionWithImage = await this.questionService.addImageToQuestion(
      id.id,
      image,
    );

    return serializeResponse(QuestionResponseDoc, questionWithImage);
  }
}
