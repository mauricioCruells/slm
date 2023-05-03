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

import { TopicService } from '../services';
import { TopicDto, UpdateTopicDto } from '../dto';
import { TopicDoc } from '../docs';

@ApiTags('Topics management endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiSingleResponse(TopicDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve a topic by id',
    summary: 'Get a topic',
  })
  @Get(':id')
  async getTopic(@Param() id: IdParamDto): Promise<SingleResponse<TopicDoc>> {
    const topic = await this.topicService.findOneById(id.id);
    return serializeResponse(TopicDoc, topic, false);
  }

  @ApiPaginatedResponse(TopicDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve the topics',
    summary: 'Get topics',
  })
  @Get()
  async getTopics(
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponse<TopicDoc[]>> {
    const [topics, total] = await this.topicService.findAll(pagination);
    return serializeMultipleResponse(TopicDoc, topics, pagination, total);
  }

  @ApiSingleResponse(TopicDoc)
  @ApiOperation({
    description: 'Use this endpoint to disable a topic by a given id',
    summary: 'Disable a topic',
  })
  @Delete(':id')
  async disableTopic(
    @Param() id: IdParamDto,
  ): Promise<SingleResponse<TopicDoc>> {
    const topic = await this.topicService.disableOne(id.id);
    return serializeResponse(TopicDoc, topic);
  }

  @ApiSingleResponse(TopicDoc)
  @ApiOperation({
    description: 'Use this endpoint to create a topic',
    summary: 'Create a topic',
  })
  @Post()
  async createTopic(
    @Body() topicDto: TopicDto,
  ): Promise<SingleResponse<TopicDoc>> {
    const topic = await this.topicService.createOne(topicDto);
    return serializeResponse(TopicDoc, topic);
  }

  @ApiSingleResponse(TopicDoc)
  @ApiOperation({
    description: 'Use this endpoint to update a topic',
    summary: 'Update topics',
  })
  @Patch(':id')
  async update(
    @Param() id: IdParamDto,
    @Body() updateTopicDto: UpdateTopicDto,
    @User() user: AuthUser,
  ): Promise<SingleResponse<TopicDoc>> {
    const updatedTopic = await this.topicService.updateOne(
      id.id,
      updateTopicDto,
      user.sub,
    );
    return serializeResponse(TopicDoc, updatedTopic);
  }
}
