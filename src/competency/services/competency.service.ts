import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DeepPartial } from 'typeorm';

import { FileStatusEnum, StatusEnum } from '@Core/enums';
import {
  flattenValidationErrors,
  notFoundByIdMessage,
  notFoundPluralMessage,
  retrieveDataFromCsvFile,
  returnFileDetailsOrThrowException,
} from '@Core/utils';
import { EvaluationRoleService } from '@Evaluation-Role/services';
import { KnowledgeAreaService } from '@Knowledge-Area/services';
import { SkillService } from '@Skill/services';
import { Skill } from '@Skill/entities';

import { CompetencyFileDetailsDoc } from '../docs';
import { CompetencyDto, CompetencyFile, UpdateCompetencyDto } from '../dtos';
import { CompetenciesFileMessagesEnum } from '../enums';
import { CompetencyRepository } from '../repositories';
import { Competency } from '../entities';
import { ICompetencyWithoutRelations } from '../interfaces';

@Injectable()
export class CompetencyService {
  constructor(
    private readonly competencyRepository: CompetencyRepository,
    private readonly knowledgeAreaService: KnowledgeAreaService,
    private readonly skillService: SkillService,
    private readonly evaluationRoleService: EvaluationRoleService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findOneById(id: number): Promise<Competency> {
    const competency = await this.competencyRepository.findOneCompetencyById(
      id,
    );

    if (!competency)
      throw new NotFoundException(notFoundByIdMessage('Competency', id));

    return competency;
  }

  async findAll(pagination): Promise<[Competency[], number]> {
    const competencies = await this.competencyRepository.findCompetencies(
      pagination,
    );

    if (!competencies.length)
      throw new NotFoundException(notFoundPluralMessage('competencies'));

    return competencies;
  }

  async findManyByUIDs(uids: string[]) {
    return this.competencyRepository.findManyByUIDS(uids);
  }

  async findManyByNames(names: string[]) {
    return this.competencyRepository.findManyByNames(names);
  }

  async disableOne(id: number): Promise<Competency> {
    const competencyToDisable = await this.findOneById(id);

    if (competencyToDisable.status === StatusEnum.INACTIVE)
      throw new BadRequestException(
        `Competency with ID ${id} is already disabled`,
      );

    competencyToDisable.status = StatusEnum.INACTIVE;
    return await this.competencyRepository.save(competencyToDisable);
  }

  async findOneByName(name: string) {
    return this.competencyRepository.findOneByName(name);
  }

  async findOneByUID(uid: string) {
    return this.competencyRepository.findOneByUid(uid);
  }

  async createOneWithSkill(
    competency: ICompetencyWithoutRelations,
    userId: number,
    skill: Skill,
    knowledgeAreaId: number | null = null,
    evaluationRolesIds: number[] | null = null,
  ) {
    const isNameOccupied = await this.findOneByName(competency.name);
    if (isNameOccupied)
      throw new BadRequestException(
        `There is already a competency with the name ${isNameOccupied.name}`,
      );
    const isUidOccupied = await this.findOneByUID(competency.uid);
    if (isUidOccupied)
      throw new BadRequestException(
        `There is already a competency with the uid ${isUidOccupied.uid}`,
      );
    let competencyToCreate: DeepPartial<Competency> = {
      ...competency,
      user: { id: userId },
      skills: [skill],
    };

    if (knowledgeAreaId) {
      const knowledgeArea = await this.knowledgeAreaService.findOneById(
        knowledgeAreaId,
      );
      competencyToCreate = { ...competencyToCreate, knowledgeArea };
    }

    if (evaluationRolesIds) {
      const evaluationRoles = await this.evaluationRoleService.findByIds(
        evaluationRolesIds,
      );
      competencyToCreate = { ...competencyToCreate, evaluationRoles };
    }
    return await this.competencyRepository.save(competencyToCreate);
  }

  async createOne(
    competencyDto: CompetencyDto,
    userId: number,
  ): Promise<Competency> {
    const competencyToSave = {
      ...competencyDto,
      id: undefined,
      evaluationRoles: undefined,
      knowledgeArea: undefined,
      user: { id: userId },
      skills: undefined,
    };
    const isNameOccupied = await this.competencyRepository.findOneByName(
      competencyDto.name,
    );
    if (isNameOccupied)
      throw new BadRequestException(
        `There is already a competency with the name ${isNameOccupied.name}`,
      );
    const isUidOccupied = await this.competencyRepository.findOneByUid(
      competencyDto.uid,
    );
    if (isUidOccupied)
      throw new BadRequestException(
        `There is already a competency with the uid ${isUidOccupied.uid}`,
      );

    if (competencyDto.knowledgeAreaId) {
      const knowledgeArea = await this.knowledgeAreaService.findOneById(
        competencyDto.knowledgeAreaId,
      );
      competencyToSave.knowledgeArea = knowledgeArea;
    }

    const evaluationRoles = await this.evaluationRoleService.findByIds(
      competencyDto.evaluationRolesIds,
    );

    competencyToSave.evaluationRoles = evaluationRoles;

    if (competencyDto.skillsIds?.length) {
      const skills = await this.skillService.findByIds(competencyDto.skillsIds);
      competencyToSave.skills = skills;
    }

    const saved = await this.competencyRepository.save(competencyToSave);
    return await this.findOneById(saved.id);
  }

  async updateOne(
    id: number,
    updateCompetencyDto: UpdateCompetencyDto,
    userId: number,
  ): Promise<Competency> {
    const competency = await this.findOneById(id);

    const updated = {
      ...competency,
      ...updateCompetencyDto,
    };

    if (updateCompetencyDto.name) {
      const isNameOccupied = await this.competencyRepository.findOneByName(
        updateCompetencyDto.name,
      );
      if (isNameOccupied && isNameOccupied.id !== id)
        throw new BadRequestException(
          `There is already a competency with the name ${isNameOccupied.name}`,
        );
    }

    if (updateCompetencyDto.uid) {
      const isUidOccupied = await this.competencyRepository.findOneByUid(
        updateCompetencyDto.uid,
      );
      if (isUidOccupied && isUidOccupied.id !== id)
        throw new BadRequestException(
          `There is already a competency with the uid ${isUidOccupied.uid}`,
        );
    }

    if (updateCompetencyDto.skillsIds?.length) {
      const skills = await this.skillService.findByIds(
        updateCompetencyDto.skillsIds,
      );
      updated.skills = skills;
    }

    if (updateCompetencyDto.evaluationRolesIds?.length) {
      const evaluationRoles = await this.evaluationRoleService.findByIds(
        updateCompetencyDto.evaluationRolesIds,
      );
      updated.evaluationRoles = evaluationRoles;
    }

    if (updateCompetencyDto.knowledgeAreaId) {
      const knowledgeArea = await this.knowledgeAreaService.findOneById(
        updateCompetencyDto.knowledgeAreaId,
      );
      updated.knowledgeArea = knowledgeArea;
    }

    const updatedCompetency = await this.competencyRepository.save(updated);

    this.eventEmitter.emit(
      'assessmentHistory.competency.update',
      updatedCompetency.id,
      userId,
    );

    return updatedCompetency;
  }

  async findByIds(ids: number[]): Promise<Competency[]> {
    const competencies = await this.competencyRepository.findByIds(ids);

    if (!competencies.length)
      throw new NotFoundException(notFoundPluralMessage('competencies'));

    if (ids.length === competencies.length) return competencies;

    const competenciesIds = competencies.map((competency) => competency.id);

    const missingIds = ids.filter((id) => !competenciesIds.includes(id));

    throw new NotFoundException(
      `Competencies with IDs [${missingIds}] were not found`,
    );
  }

  async uploadFileAndSave(
    file: Express.Multer.File,
    userId: number,
  ): Promise<CompetencyFileDetailsDoc[]> {
    const plainCompetencies = await retrieveDataFromCsvFile(file);

    if (!plainCompetencies.length)
      throw new BadRequestException(
        'There are no competencies included in the uploaded file',
      );

    const serializedCompetenciesFile = plainToInstance(CompetencyFile, {
      competencies: plainCompetencies,
    });
    const validationErrors = await validate(serializedCompetenciesFile, {
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
    });
    if (validationErrors.length) {
      const flattenedValidationErrors =
        flattenValidationErrors(validationErrors);
      const badList = flattenedValidationErrors.some(
        (message) =>
          message.includes('__EMPTY') && message.includes('should not exist'),
      );
      if (badList) {
        const finalValidationErrors = flattenedValidationErrors.filter(
          (message) =>
            !(
              message.includes('__EMPTY') &&
              message.includes('should not exist')
            ),
        );
        finalValidationErrors.push(
          `evaluationRoleNames & skillNames should start and end with double quotes and separated with comma ','`,
        );
        throw new BadRequestException(finalValidationErrors);
      } else {
        throw new BadRequestException(flattenedValidationErrors);
      }
    }
    const currentUser = { id: userId };

    const {
      competenciesUID,
      names,
      evaluationRoleNames,
      skillUids,
      knowledgeAreaNames,
    } = serializedCompetenciesFile.competencies.reduce(
      (
        acc,
        {
          competencyUID,
          name,
          description,
          evaluationRoleNames,
          skillUids,
          knowledgeAreaName,
        },
      ) => {
        acc.competenciesUID.push(competencyUID);
        acc.names.push(name);
        acc.descriptions.push(description);
        acc.evaluationRoleNames.push(
          evaluationRoleNames.split(',').map((roleName) => roleName.trim()),
        );
        acc.skillUids.push(
          skillUids.split(',').map((skillUid) => skillUid.trim()),
        );
        acc.knowledgeAreaNames.push(knowledgeAreaName);
        return acc;
      },
      {
        competenciesUID: [] as string[],
        names: [] as string[],
        descriptions: [] as string[],
        evaluationRoleNames: [] as string[][],
        skillUids: [] as string[][],
        knowledgeAreaNames: [] as string[],
      },
    );
    const filteredNames = [...new Set(names)];
    const filteredCompetenciesUID = [...new Set(competenciesUID)];
    const filteredKnowledgeAreaNames = [...new Set(knowledgeAreaNames)];
    const filteredSkillUids = [...new Set(skillUids.flat())];
    const filteredEvalutaionRoleNames = [
      ...new Set(evaluationRoleNames.flat()),
    ];

    const existingUIDS = await this.competencyRepository.findManyByUIDS(
      filteredCompetenciesUID,
    );
    const { flattenedExistingUIDS } = existingUIDS.reduce(
      (acc, currentCompetency) => {
        acc.flattenedExistingUIDS.push(currentCompetency.uid);
        return acc;
      },
      { flattenedExistingUIDS: [] as string[] },
    );
    const existingNames = await this.competencyRepository.findManyByNames(
      filteredNames,
    );
    const { flattenedExistingNames } = existingNames.reduce(
      (acc, currentCompetency) => {
        acc.flattenedExistingNames.push(currentCompetency.name);
        return acc;
      },
      { flattenedExistingNames: [] as string[] },
    );

    const existingKnowledgeAreaNames =
      await this.knowledgeAreaService.findManyByName(
        filteredKnowledgeAreaNames,
      );
    const flattenedExistingKnowledgeAreaNames = existingKnowledgeAreaNames.map(
      (knowledgeArea) => knowledgeArea.name,
    );

    const existingEvaluationRoles =
      await this.evaluationRoleService.findManyByName(
        filteredEvalutaionRoleNames,
      );
    const flattenedExistingEvaluationRoleNames = existingEvaluationRoles.map(
      (evaluationRole) => evaluationRole.name,
    );

    const existingSkills = await this.skillService.findManyByUIDs(
      filteredSkillUids,
    );
    const flattenedExistingSkillUids = existingSkills.map((skill) => skill.uid);
    const skillsAlreadyRelated = existingSkills.filter(
      (skill) => skill.competency,
    );
    const alreadyRelatedSkillUids = skillsAlreadyRelated.map(
      (skill) => skill.uid,
    );

    const details: CompetencyFileDetailsDoc[] = [];

    const filterCompetencies = serializedCompetenciesFile.competencies.map(
      (competency) => {
        const competencyDetails: CompetencyFileDetailsDoc = {
          name: competency.name,
          uid: competency.competencyUID,
          description: competency.description,
          weight: competency.weight,
          knowledgeArea: competency.knowledgeAreaName,
          roles: competency.evaluationRoleNames
            .split(',')
            .map((role) => role.trim()),
          skills: competency.skillUids.split(',').map((skill) => skill.trim()),
          result: FileStatusEnum.UPLOADED,
          details: [],
        };

        const uidAlreadyInFile = details?.filter((competencyDetailed) => {
          return (
            competencyDetailed.uid === competencyDetails.uid &&
            competencyDetailed.result === FileStatusEnum.UPLOADED
          );
        });
        if (
          flattenedExistingUIDS.includes(competency.competencyUID) ||
          uidAlreadyInFile.length
        ) {
          competencyDetails.details.push(
            CompetenciesFileMessagesEnum.UID_DUPLICATED,
          );
        }
        const nameAlreadyInFile = details?.filter((competencyDetailed) => {
          return (
            competencyDetailed.name === competencyDetails.name &&
            competencyDetailed.result === FileStatusEnum.UPLOADED
          );
        });
        if (
          flattenedExistingNames.includes(competency.name) ||
          nameAlreadyInFile.length
        ) {
          competencyDetails.details.push(
            CompetenciesFileMessagesEnum.NAME_DUPLICATED,
          );
        }

        const invalidKnowledgeAreaName =
          !flattenedExistingKnowledgeAreaNames.includes(
            competencyDetails.knowledgeArea,
          );
        if (invalidKnowledgeAreaName) {
          competencyDetails.details.push(
            CompetenciesFileMessagesEnum.INVALID_KNOWLEDGE_AREA,
          );
        }

        const validEvaluationRoleNames = (roleNames: string[]) => {
          const isValid = roleNames.every((roleName) =>
            flattenedExistingEvaluationRoleNames.includes(roleName),
          );
          return isValid;
        };
        if (!validEvaluationRoleNames(competencyDetails.roles)) {
          competencyDetails.details.push(
            CompetenciesFileMessagesEnum.INVALID_EVALUATION_ROLE_NAME,
          );
        }

        const validSkillUids = (skillUids: string[]) => {
          const isValid = skillUids.every((skillUids) =>
            flattenedExistingSkillUids.includes(skillUids),
          );
          return isValid;
        };

        if (!validSkillUids(competencyDetails.skills)) {
          competencyDetails.details.push(
            CompetenciesFileMessagesEnum.INVALID_SKILL,
          );
        }

        const skillAlreadyRelated = (skillUids: string[]) => {
          const isRelated = skillUids.some((skillUid) =>
            alreadyRelatedSkillUids.includes(skillUid),
          );
          return isRelated;
        };

        const skillInListAlready = (skillUids: string[]) => {
          const skillsSet = [...new Set(skillUids)];
          return !(skillsSet.length === skillUids.length);
        };

        if (skillInListAlready(competencyDetails.skills)) {
          competencyDetails.details.push(
            CompetenciesFileMessagesEnum.DUPLICATED_SKILL,
          );
        }

        const skillInFileAlready = (
          skillUids: string[],
          competencies: CompetencyFileDetailsDoc[],
        ) => {
          const skillsSet = [...new Set(skillUids)];
          if (skillsSet.length !== skillUids.length) return false;
          const alreadyInFile = competencies?.some((competencyDetailed) => {
            const currentSkillsSet = [...new Set(competencyDetailed.skills)];
            const combinedSet = [
              ...new Set([...skillsSet, ...currentSkillsSet]),
            ];
            return (
              combinedSet.length !==
                skillsSet.length + currentSkillsSet.length &&
              competencyDetailed.result === FileStatusEnum.UPLOADED
            );
          });
          return alreadyInFile;
        };

        if (
          skillAlreadyRelated(competencyDetails.skills) ||
          skillInFileAlready(competencyDetails.skills, details)
        ) {
          competencyDetails.details.push(
            CompetenciesFileMessagesEnum.ALREADY_RELATED_SKILL,
          );
        }

        if (competencyDetails.details.length) {
          competencyDetails.result = FileStatusEnum.ERROR;
          details.push(competencyDetails);
          return;
        }
        competencyDetails.details.push(CompetenciesFileMessagesEnum.SUCCESSFUL);
        details.push(competencyDetails);

        const skillsToSave = existingSkills.filter((skill) =>
          competencyDetails.skills.includes(skill.name),
        );
        const knowledgeAreaToSave = existingKnowledgeAreaNames.find(
          (knowledgeArea) =>
            knowledgeArea.name === competency.knowledgeAreaName,
        );
        const evaluationRolesToSave = existingEvaluationRoles.filter(
          (evaluationRole) =>
            competencyDetails.roles.includes(evaluationRole.name),
        );
        const competencyConstructor = {
          id: undefined,
          name: competency.name,
          uid: competency.competencyUID,
          description: competency.description,
          weight: competency.weight,
          skills: skillsToSave,
          knowledgeArea: knowledgeAreaToSave,
          evaluationRoles: evaluationRolesToSave,
          user: currentUser,
        };

        return competencyConstructor;
      },
    );
    const competenciesToSave = filterCompetencies.filter(Boolean);
    if (competenciesToSave.length) {
      await this.competencyRepository.save(competenciesToSave);
    }

    return returnFileDetailsOrThrowException(details, 'competencies');
  }
}
