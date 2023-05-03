import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  flattenValidationErrors,
  notFoundByIdMessage,
  notFoundPluralMessage,
  retrieveDataFromCsvFile,
  returnFileDetailsOrThrowException,
} from '@Core/utils';
import { FileStatusEnum, StatusEnum } from '@Core/enums';
import { PaginationDto } from '@Core/dto';
import { AuthUser } from '@Auth/decorators';
import { UserRole } from '@Role/enums';
import { User } from '@User/entities';

import { KnowledgeAreaRepository } from '../repositories';
import { KnowledgeArea } from '../entities';
import {
  KnowledgeAreaDto,
  KnowledgeAreaFile,
  UpdateKnowledgeAreaDto,
} from '../dtos';
import { KnowledgeAreaFileDetailsDoc } from '../docs';
import { KnowledgeAreasFileMessagesEnum } from '../enums';

@Injectable()
export class KnowledgeAreaService {
  constructor(
    private readonly knowledgeAreaRepository: KnowledgeAreaRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findOneById(id: number): Promise<KnowledgeArea> {
    const knowledgeArea =
      await this.knowledgeAreaRepository.findOneKnowledgeAreaById(id);

    if (!knowledgeArea)
      throw new NotFoundException(notFoundByIdMessage('Knowledge area', id));

    return knowledgeArea;
  }

  async findManyById(ids: number[]): Promise<KnowledgeArea[]> {
    const knowledgeAreas = await this.knowledgeAreaRepository.findManyByIds(
      ids,
    );

    if (!knowledgeAreas.length) {
      throw new NotFoundException(notFoundPluralMessage('Knowledge Areas'));
    }

    return knowledgeAreas;
  }

  async findAllPaginated(
    pagination: PaginationDto,
    loggedUser: AuthUser,
  ): Promise<[KnowledgeArea[], number]> {
    if (loggedUser.role !== UserRole.INTERVIEWEE) {
      return this.knowledgeAreaRepository.getAllKnowledgeAreasPaginated(
        pagination,
      );
    }
    const [user]: unknown[] = await this.eventEmitter.emitAsync(
      'knowledge-area.getOneUserById',
      loggedUser.sub,
    );
    if (user instanceof User) {
      const evaluationRole = user.evaluationRole;
      if (!evaluationRole) {
        throw new ConflictException(
          `User doesn't have a valid evaluation role`,
        );
      }
      const knowledgeAreas =
        await this.knowledgeAreaRepository.getKnowledgeAreasByEvaluationRolePaginated(
          pagination,
          evaluationRole.name,
        );
      return knowledgeAreas;
    }
  }

  async findManyByName(names: string[]): Promise<KnowledgeArea[]> {
    return await this.knowledgeAreaRepository.findManyByNames(names);
  }

  async disableOne(id: number): Promise<KnowledgeArea> {
    const knowledgeAreaToDisable = await this.findOneById(id);

    if (knowledgeAreaToDisable.status === StatusEnum.INACTIVE)
      throw new BadRequestException(
        `Knowledge area with ID ${id} is already disabled`,
      );

    knowledgeAreaToDisable.status = StatusEnum.INACTIVE;
    return await this.knowledgeAreaRepository.save(knowledgeAreaToDisable);
  }

  async createOne(knowledgeAreaDto: KnowledgeAreaDto): Promise<KnowledgeArea> {
    const isNameOccupied = await this.knowledgeAreaRepository.findOneByName(
      knowledgeAreaDto.name,
    );
    if (isNameOccupied)
      throw new BadRequestException(
        `There is already a knowledge area with the name ${isNameOccupied.name}`,
      );
    const isUidOccupied = await this.knowledgeAreaRepository.findOneByUid(
      knowledgeAreaDto.uid,
    );
    if (isUidOccupied)
      throw new BadRequestException(
        `There is already a knowledge area with the uid ${isUidOccupied.uid}`,
      );

    const knowledgeAreaToSave = {
      ...knowledgeAreaDto,
      id: undefined,
      competencies: undefined,
    };

    if (knowledgeAreaDto.competenciesIds) {
      await this.eventEmitter.emitAsync(
        'knowledge-area.competenciesIds',
        knowledgeAreaDto.competenciesIds,
      );
      const competenciesIds = knowledgeAreaDto.competenciesIds.map(
        (competencyId) => {
          return { id: competencyId };
        },
      );
      knowledgeAreaToSave.competencies = competenciesIds;
    }

    const saved = await this.knowledgeAreaRepository.save(knowledgeAreaToSave);

    return await this.findOneById(saved.id);
  }

  async updateOne(
    id: number,
    updateKnowledgeAreaDto: UpdateKnowledgeAreaDto,
    userId: number,
  ): Promise<KnowledgeArea> {
    const knowledgeArea = await this.findOneById(id);

    const updated = {
      ...knowledgeArea,
      ...updateKnowledgeAreaDto,
    };

    if (updateKnowledgeAreaDto.name) {
      const isNameOccupied = await this.knowledgeAreaRepository.findOneByName(
        updateKnowledgeAreaDto.name,
      );
      if (isNameOccupied && isNameOccupied.id !== id)
        throw new BadRequestException(
          `There is already a knowledge area with the name ${isNameOccupied.name}`,
        );
    }

    if (updateKnowledgeAreaDto.uid) {
      const isUidOccupied = await this.knowledgeAreaRepository.findOneByUid(
        updateKnowledgeAreaDto.uid,
      );
      if (isUidOccupied && isUidOccupied.id !== id)
        throw new BadRequestException(
          `There is already a knowledge area with the uid ${isUidOccupied.uid}`,
        );
    }

    if (updateKnowledgeAreaDto.competenciesIds?.length) {
      const [competencies] = await this.eventEmitter.emitAsync(
        'knowledge-area.competenciesIds',
        updateKnowledgeAreaDto.competenciesIds,
        id,
      );

      updated.competencies = competencies;
    }

    await this.knowledgeAreaRepository.save(updated);

    this.eventEmitter.emit(
      'assessmentHistory.knowledgeArea.update',
      updated.id,
      userId,
    );

    return await this.findOneById(updated.id);
  }

  async uploadFileAndSave(
    file: Express.Multer.File,
  ): Promise<KnowledgeAreaFileDetailsDoc[]> {
    const plainKnowledgeAreas = await retrieveDataFromCsvFile(file);

    if (!plainKnowledgeAreas.length)
      throw new BadRequestException(
        'There are no knowledge areas included in the uploaded file',
      );

    const serializedKnowledgeAreasFile = plainToInstance(KnowledgeAreaFile, {
      knowledgeAreas: plainKnowledgeAreas,
    });
    const validationErrors = await validate(serializedKnowledgeAreasFile, {
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
    });
    if (validationErrors.length)
      throw new BadRequestException(flattenValidationErrors(validationErrors));

    const { uids, names } = serializedKnowledgeAreasFile.knowledgeAreas.reduce(
      (acc, { uid, name }) => {
        acc.uids.push(uid);
        acc.names.push(name);
        return acc;
      },
      {
        uids: [] as string[],
        names: [] as string[],
      },
    );
    const filteredUIDs = [...new Set(uids)];
    const filteredNames = [...new Set(names)];

    const existingUIDS = await this.knowledgeAreaRepository.findManyByUIDS(
      filteredUIDs,
    );
    const { flattenedExistingUIDS } = existingUIDS.reduce(
      (acc, currentKnowledgeArea) => {
        acc.flattenedExistingUIDS.push(currentKnowledgeArea.uid);
        return acc;
      },
      { flattenedExistingUIDS: [] as string[] },
    );

    const existingNames = await this.knowledgeAreaRepository.findManyByNames(
      filteredNames,
    );
    const { flattenedExistingNames } = existingNames.reduce(
      (acc, currentKnowledgeArea) => {
        acc.flattenedExistingNames.push(currentKnowledgeArea.name);
        return acc;
      },
      { flattenedExistingNames: [] as string[] },
    );

    const details: KnowledgeAreaFileDetailsDoc[] = [];

    const filterKnowledgeAreas =
      serializedKnowledgeAreasFile.knowledgeAreas.map((knowledgeArea) => {
        const knowledgeAreaDetails: KnowledgeAreaFileDetailsDoc = {
          name: knowledgeArea.name,
          uid: knowledgeArea.uid,
          description: knowledgeArea.description,
          L1LowerScore: knowledgeArea.L1LowerScore,
          L1UpperScore: knowledgeArea.L1UpperScore,
          L2LowerScore: knowledgeArea.L2LowerScore,
          L2UpperScore: knowledgeArea.L2UpperScore,
          L3LowerScore: knowledgeArea.L3LowerScore,
          L3UpperScore: knowledgeArea.L3UpperScore,
          L4LowerScore: knowledgeArea.L4LowerScore,
          L4UpperScore: knowledgeArea.L4UpperScore,
          L5LowerScore: knowledgeArea.L5LowerScore,
          L5UpperScore: knowledgeArea.L5UpperScore,
          L6LowerScore: knowledgeArea.L6LowerScore,
          L6UpperScore: knowledgeArea.L6UpperScore,
          L7LowerScore: knowledgeArea.L7LowerScore,
          L7UpperScore: knowledgeArea.L7UpperScore,
          result: FileStatusEnum.UPLOADED,
          details: [],
        };

        const uidAlreadyInFile = details?.filter((knowledgeAreaDetailed) => {
          return (
            knowledgeAreaDetailed.uid === knowledgeAreaDetails.uid &&
            knowledgeAreaDetailed.result === FileStatusEnum.UPLOADED
          );
        });
        if (
          flattenedExistingUIDS.includes(knowledgeArea.uid) ||
          uidAlreadyInFile.length
        ) {
          knowledgeAreaDetails.details.push(
            KnowledgeAreasFileMessagesEnum.UID_DUPLICATED,
          );
        }
        const nameAlreadyInFile = details?.filter((knowledgeAreaDetailed) => {
          return (
            knowledgeAreaDetailed.name === knowledgeAreaDetails.name &&
            knowledgeAreaDetailed.result === FileStatusEnum.UPLOADED
          );
        });
        if (
          flattenedExistingNames.includes(knowledgeArea.name) ||
          nameAlreadyInFile.length
        ) {
          knowledgeAreaDetails.details.push(
            KnowledgeAreasFileMessagesEnum.NAME_DUPLICATED,
          );
        }

        if (knowledgeAreaDetails.details.length) {
          knowledgeAreaDetails.result = FileStatusEnum.ERROR;
          details.push(knowledgeAreaDetails);
          return;
        }
        knowledgeAreaDetails.details.push(
          KnowledgeAreasFileMessagesEnum.SUCCESSFUL,
        );
        details.push(knowledgeAreaDetails);

        const knowledgeAreaConstructor = {
          id: undefined,
          name: knowledgeArea.name,
          uid: knowledgeArea.uid,
          description: knowledgeArea.description,
          L1LowerScore: knowledgeArea.L1LowerScore,
          L1UpperScore: knowledgeArea.L1UpperScore,
          L2LowerScore: knowledgeArea.L2LowerScore,
          L2UpperScore: knowledgeArea.L2UpperScore,
          L3LowerScore: knowledgeArea.L3LowerScore,
          L3UpperScore: knowledgeArea.L3UpperScore,
          L4LowerScore: knowledgeArea.L4LowerScore,
          L4UpperScore: knowledgeArea.L4UpperScore,
          L5LowerScore: knowledgeArea.L5LowerScore,
          L5UpperScore: knowledgeArea.L5UpperScore,
          L6LowerScore: knowledgeArea.L6LowerScore,
          L6UpperScore: knowledgeArea.L6UpperScore,
          L7LowerScore: knowledgeArea.L7LowerScore,
          L7UpperScore: knowledgeArea.L7UpperScore,
        };

        return knowledgeAreaConstructor;
      });
    const knowledgeAreasToSave = filterKnowledgeAreas.filter(Boolean);
    if (knowledgeAreasToSave)
      await this.knowledgeAreaRepository.save(knowledgeAreasToSave);

    return returnFileDetailsOrThrowException(details, 'knowledge areas');
  }

  async findByName(name: string): Promise<KnowledgeArea[]> {
    return await this.knowledgeAreaRepository.findManyByName(name);
  }
}
