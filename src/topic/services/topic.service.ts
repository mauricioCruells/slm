import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { notFoundByIdMessage, notFoundPluralMessage } from '@Core/utils';
import { SkillService } from '@Skill/services';
import { StatusEnum } from '@Core/enums';
import { PaginationDto } from '@Core/dto';

import { TopicRepository } from '../repositories';
import { Topic } from '../entities';
import { TopicDto, UpdateTopicDto } from '../dto';
import { TopicWithoutRelations } from '../interfaces';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly skillService: SkillService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findManyByName(names: string[]): Promise<Topic[]> {
    return this.topicRepository.findManyByNames(names);
  }

  async findManyByUIDs(uids: string[]): Promise<Topic[]> {
    return this.topicRepository.findManyByUIDs(uids);
  }

  async findByIds(ids: number[]): Promise<Topic[]> {
    const topics = await this.topicRepository.findByIds(ids);

    if (!topics.length)
      throw new NotFoundException(notFoundPluralMessage('topics'));

    if (ids.length === topics.length) return topics;

    const topicsIds = topics.map((topic) => topic.id);

    const missingIds = ids.filter((id) => !topicsIds.includes(id));

    throw new NotFoundException(
      `Topics with IDs [${missingIds}] were not found`,
    );
  }

  async findOneById(id: number): Promise<Topic> {
    const topic = await this.topicRepository.findOneTopicById(id);

    if (!topic) throw new NotFoundException(notFoundByIdMessage('Topic', id));

    return topic;
  }

  async findAll(pagination: PaginationDto): Promise<[Topic[], number]> {
    const topics = await this.topicRepository.findAll(pagination);

    return topics;
  }

  async disableOne(id: number): Promise<Topic> {
    const topicToDisable = await this.findOneById(id);

    if (topicToDisable.status === StatusEnum.INACTIVE)
      throw new BadRequestException(`Topic with ID ${id} is already disabled`);

    topicToDisable.status = StatusEnum.INACTIVE;
    return await this.topicRepository.save(topicToDisable);
  }

  async createOneWithoutRelations(topicToSave: TopicWithoutRelations) {
    return await this.topicRepository.save(topicToSave);
  }

  async createOne(topicDto: TopicDto): Promise<Topic> {
    const isUidOccupied = await this.topicRepository.findOne({
      where: { uid: topicDto.uid },
    });
    if (isUidOccupied)
      throw new BadRequestException(
        `There is already a topic with the uid ${isUidOccupied.uid}`,
      );

    const topicToSave = {
      ...topicDto,
      id: undefined,
      skill: undefined,
    };

    if (topicDto.skillId) {
      const skill = await this.skillService.findOneById(topicDto.skillId);
      topicToSave.skill = skill;
    }

    const saved = await this.topicRepository.save(topicToSave);

    return await this.findOneById(saved.id);
  }

  async updateOne(
    id: number,
    updateTopicDto: UpdateTopicDto,
    userId: number,
  ): Promise<Topic> {
    const topic = await this.findOneById(id);

    const updated = {
      ...topic,
      ...updateTopicDto,
    };

    if (updateTopicDto.uid) {
      const isUidOccupied = await this.topicRepository.findOneByUid(
        updateTopicDto.uid,
      );
      if (isUidOccupied && isUidOccupied.id !== id)
        throw new BadRequestException(
          `There is already a topic with the uid ${isUidOccupied.uid}`,
        );
    }

    if (updateTopicDto.skillId) {
      const skill = await this.skillService.findOneById(updateTopicDto.skillId);
      updated.skill = skill;
    }

    const updatedTopic = await this.topicRepository.save(updated);

    this.eventEmitter.emit(
      'assessmentHistory.topic.update',
      updated.id,
      userId,
    );

    return updatedTopic;
  }
}
