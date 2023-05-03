import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { notFoundByIdMessage, notFoundPluralMessage } from '@Core/utils';
import { StatusEnum } from '@Core/enums';

import { SkillRepository } from '../repositories';
import { Skill } from '../entities';
import { SkillDto, UpdateSkillDto } from '../dtos';
import { PaginationDto } from '@Core/dto';

@Injectable()
export class SkillService {
  constructor(
    private readonly skillRepository: SkillRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findManyByName(names: string[]): Promise<Skill[]> {
    return await this.skillRepository.findManyByNames(names);
  }

  async findManyByUIDs(uids: string[]): Promise<Skill[]> {
    return await this.skillRepository.findManyByUIDs(uids);
  }

  async findByIds(ids: number[]): Promise<Skill[]> {
    const skills = await this.skillRepository.findByIds(ids);

    if (!skills.length)
      throw new NotFoundException(notFoundPluralMessage('skills'));

    if (ids.length === skills.length) return skills;

    const skillsIds = skills.map((skill) => skill.id);

    const missingIds = ids.filter((id) => !skillsIds.includes(id));

    throw new NotFoundException(
      `Skills with IDs [${missingIds}] were not found`,
    );
  }

  async findOneById(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOneSkillById(id);

    if (!skill) throw new NotFoundException(notFoundByIdMessage('Skill', id));

    return skill;
  }

  async findAll(pagination: PaginationDto): Promise<[Skill[], number]> {
    const skills = await this.skillRepository.findAll(pagination);
    return skills;
  }

  async disableOne(id: number): Promise<Skill> {
    const skillToDisable = await this.findOneById(id);

    if (skillToDisable.status === StatusEnum.INACTIVE)
      throw new BadRequestException(`Skill with ID ${id} is already disabled`);

    skillToDisable.status = StatusEnum.INACTIVE;
    return await this.skillRepository.save(skillToDisable);
  }

  async createOne(skillDto: SkillDto): Promise<Skill> {
    const isUidOccupied = await this.skillRepository.findOneByUid(skillDto.uid);
    if (isUidOccupied)
      throw new BadRequestException(
        `There is already a skill with the uid ${isUidOccupied.uid}`,
      );

    const skillToSave = {
      ...skillDto,
      id: undefined,
      topics: undefined,
      competency: undefined,
    };

    if (skillDto.competencyId) {
      const [competency] = await this.eventEmitter.emitAsync(
        'skill.competency',
        skillDto.competencyId,
      );

      skillToSave.competency = competency;
    }

    if (skillDto.topicsIds?.length) {
      await this.eventEmitter.emitAsync('skill.topicsIds', skillDto.topicsIds);
      const topicsIds = skillDto.topicsIds.map((topicId) => {
        return { id: topicId };
      });
      skillToSave.topics = topicsIds;
    }

    return await this.skillRepository.save(skillToSave);
  }

  async updateOne(
    id: number,
    updateSkillDto: UpdateSkillDto,
    userId: number,
  ): Promise<Skill> {
    const skill = await this.findOneById(id);

    const updated = {
      ...skill,
      ...updateSkillDto,
    };

    if (updateSkillDto.uid) {
      const isUidOccupied = await this.skillRepository.findOneByUid(
        updateSkillDto.uid,
      );
      if (isUidOccupied && isUidOccupied.id !== id)
        throw new BadRequestException(
          `There is already a skill with the uid ${isUidOccupied.uid}`,
        );
    }

    if (updateSkillDto.topicsIds?.length) {
      const [topics] = await this.eventEmitter.emitAsync(
        'skill.topicsIds',
        updateSkillDto.topicsIds,
      );

      updated.topics = topics;
    }
    if (updateSkillDto.competencyId) {
      const [competency] = await this.eventEmitter.emitAsync(
        'skill.competency',
        updateSkillDto.competencyId,
      );
      updated.competency = competency;
    }

    const updatedSkill = await this.skillRepository.save(updated);

    this.eventEmitter.emit(
      'assessmentHistory.skill.update',
      updated.id,
      userId,
    );

    return updatedSkill;
  }
}
