import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { FileStatusEnum } from '@Core/enums';
import {
  flattenValidationErrors,
  retrieveDataFromCsvFile,
  returnFileDetailsOrThrowException,
} from '@Core/utils';
import { SkillService } from '@Skill/services';
import { TopicService } from '@Topic/services';
import { Skill } from '@Skill/entities';
import { UpdateCompetencyDto } from '@Competency/dtos';
import { CompetencyService } from '@Competency/services';
import { CategoryService } from '@Category/services';
import { EvaluationRoleService } from '@Evaluation-Role/services';

import { MasterFileDetailsDoc } from '../docs';
import { MasterFileMessagesEnum } from '../enums';
import { MasterFileDto, MasterFileParamsDto } from '../dtos';
import { IMasterFileDataToSave } from '../interfaces';

@Injectable()
export class MasterFileService {
  constructor(
    private readonly competencyService: CompetencyService,
    private readonly skillService: SkillService,
    private readonly topicService: TopicService,
    private readonly categoryService: CategoryService,
    private readonly evaluationRoleService: EvaluationRoleService,
  ) {}

  async uploadMasterFile(
    file: Express.Multer.File,
    userId: number,
    {
      category: categoryId,
      knowledgeArea: knowledgeAreaId,
      evaluationRole: evaluationRolesIds,
    }: MasterFileParamsDto,
  ): Promise<MasterFileDetailsDoc[]> {
    const category = await this.categoryService.findOne(categoryId);

    const categoryHasKnowledgeArea = category.knowledgeAreas.some(
      (knowledgeArea) => knowledgeArea.id === knowledgeAreaId,
    );

    if (!categoryHasKnowledgeArea) {
      throw new UnprocessableEntityException(
        `KnowledgeArea with id: ${knowledgeAreaId} doesn't exist in Category with id: ${category.id}`,
      );
    }

    // this service method handles not found exceptions for evaluation roles
    await this.evaluationRoleService.findByIds(evaluationRolesIds);

    const plainData = await retrieveDataFromCsvFile(file);
    if (!plainData.length)
      throw new BadRequestException(
        'There is no data included in the uploaded file',
      );

    const serializedMasterFile = plainToInstance(MasterFileDto, {
      data: plainData,
    });

    const validationErrors = await validate(serializedMasterFile, {
      whitelist: true,
      stopAtFirstError: false,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length) {
      const flattenedValidationErrors =
        flattenValidationErrors(validationErrors);
      const badDescriptionOrComment = flattenedValidationErrors.some(
        (message) =>
          message.includes('__EMPTY') && message.includes('should not exist'),
      );
      if (badDescriptionOrComment) {
        const finalValidationErrors = flattenedValidationErrors.map(
          (message) => {
            return message.replace(
              '.property __EMPTY should not exist',
              ' Descriptions and comments must start and end with double quotes',
            );
          },
        );
        throw new BadRequestException(finalValidationErrors);
      } else {
        throw new BadRequestException(flattenedValidationErrors);
      }
    }
    const {
      competencyNames,
      competencyUIDs,
      skillNames,
      skillUIDs,
      topicNames,
      topicUIDs,
    } = serializedMasterFile.data.reduce(
      (
        acc,
        {
          competencyUID,
          competencyName,
          skillName,
          skillUID,
          topicName,
          topicUID,
        },
      ) => {
        acc.competencyUIDs.push(competencyUID);
        acc.competencyNames.push(competencyName);
        acc.skillNames.push(skillName);
        acc.skillUIDs.push(skillUID);
        acc.topicNames.push(topicName);
        acc.topicUIDs.push(topicUID);

        return acc;
      },
      {
        competencyUIDs: [] as string[],
        competencyNames: [] as string[],
        skillNames: [] as string[],
        skillUIDs: [] as string[],
        topicNames: [] as string[],
        topicUIDs: [] as string[],
      },
    );

    const filteredCompetencyNames = [...new Set(competencyNames)];
    const filteredCompetencyUIDs = [...new Set(competencyUIDs)];
    const filteredSkillNames = [...new Set(skillNames)];
    const filteredSkillUIDs = [...new Set(skillUIDs)];
    const filteredTopicNames = [...new Set(topicNames)];
    const filteredTopicUIDs = [...new Set(topicUIDs)];

    const existingCompetencyUIDS = await this.competencyService.findManyByUIDs(
      filteredCompetencyUIDs,
    );
    const { flattenedExistingCompetencyUIDs } = existingCompetencyUIDS.reduce(
      (acc, currentCompetency) => {
        acc.flattenedExistingCompetencyUIDs.push(currentCompetency.uid);
        return acc;
      },
      { flattenedExistingCompetencyUIDs: [] as string[] },
    );
    const existingCompetencyNames =
      await this.competencyService.findManyByNames(filteredCompetencyNames);
    const { flattenedExistingCompetencyNames } = existingCompetencyNames.reduce(
      (acc, currentCompetency) => {
        acc.flattenedExistingCompetencyNames.push(currentCompetency.name);
        return acc;
      },
      { flattenedExistingCompetencyNames: [] as string[] },
    );

    const existingSkillNames = await this.skillService.findManyByName(
      filteredSkillNames,
    );
    const { flattenedExistingSkillNames } = existingSkillNames.reduce(
      (acc, currentSkill) => {
        acc.flattenedExistingSkillNames.push(currentSkill.name);
        return acc;
      },
      { flattenedExistingSkillNames: [] as string[] },
    );

    const existingSkillUIDs = await this.skillService.findManyByUIDs(
      filteredSkillUIDs,
    );
    const { flattenedExistingSkillUIDs } = existingSkillUIDs.reduce(
      (acc, currentSkill) => {
        acc.flattenedExistingSkillUIDs.push(currentSkill.uid);
        return acc;
      },
      { flattenedExistingSkillUIDs: [] as string[] },
    );

    const existingTopicNames = await this.topicService.findManyByName(
      filteredTopicNames,
    );
    const { flattenedExistingTopicNames } = existingTopicNames.reduce(
      (acc, currentSkill) => {
        acc.flattenedExistingTopicNames.push(currentSkill.name);
        return acc;
      },
      { flattenedExistingTopicNames: [] as string[] },
    );

    const existingTopicUIDs = await this.topicService.findManyByUIDs(
      filteredTopicUIDs,
    );
    const { flattenedExistingTopicUIDs } = existingTopicUIDs.reduce(
      (acc, currentSkill) => {
        acc.flattenedExistingTopicUIDs.push(currentSkill.uid);
        return acc;
      },
      { flattenedExistingTopicUIDs: [] as string[] },
    );

    const details: MasterFileDetailsDoc[] = [];

    const filterData: IMasterFileDataToSave[] = serializedMasterFile.data.map(
      (data) => {
        const dataDetails: MasterFileDetailsDoc = {
          competencyName: data.competencyName,
          competencyUID: data.competencyUID,
          competencyDescription: data.competencyDescription,
          skillName: data.skillName,
          skillUID: data.skillUID,
          skillDescription: data.skillDescription,
          topicName: data.topicName,
          topicUID: data.topicUID,
          topicDescription: data.topicDescription,
          comment: data.comment,
          result: FileStatusEnum.UPLOADED,
          details: [],
        };

        const topicUIDAlreadyInFile = details?.filter((dataDetailed) => {
          return (
            dataDetailed.topicUID === dataDetails.topicUID &&
            dataDetailed.result === FileStatusEnum.UPLOADED
          );
        });
        if (
          flattenedExistingTopicUIDs.includes(data.topicUID) ||
          topicUIDAlreadyInFile.length
        ) {
          dataDetails.details.push(MasterFileMessagesEnum.TOPIC_UID_DUPLICATED);
        }
        const topicNameAlreadyInFile = details?.filter((dataDetailed) => {
          return (
            dataDetailed.topicName === dataDetails.topicName &&
            dataDetailed.result === FileStatusEnum.UPLOADED
          );
        });
        if (
          flattenedExistingTopicNames.includes(data.topicName) ||
          topicNameAlreadyInFile.length
        ) {
          dataDetails.details.push(
            MasterFileMessagesEnum.TOPIC_NAME_DUPLICATED,
          );
        }

        const invalidCompetencyName = flattenedExistingCompetencyNames.includes(
          dataDetails.competencyName,
        );
        if (invalidCompetencyName) {
          dataDetails.details.push(
            MasterFileMessagesEnum.COMPETENCY_NAME_DUPLICATED,
          );
        }

        const invalidCompetencyUID = flattenedExistingCompetencyUIDs.includes(
          dataDetails.competencyUID,
        );
        if (invalidCompetencyUID) {
          dataDetails.details.push(
            MasterFileMessagesEnum.COMPETENCY_UID_DUPLICATED,
          );
        }

        const invalidSkillName = flattenedExistingSkillNames.includes(
          dataDetails.skillName,
        );
        if (invalidSkillName) {
          dataDetails.details.push(
            MasterFileMessagesEnum.SKILL_NAME_DUPLICATED,
          );
        }

        const invalidSkillUID = flattenedExistingSkillUIDs.includes(
          dataDetails.skillUID,
        );
        if (invalidSkillUID) {
          dataDetails.details.push(MasterFileMessagesEnum.SKILL_UID_DUPLICATED);
        }

        if (dataDetails.details.length) {
          dataDetails.result = FileStatusEnum.ERROR;
          details.push(dataDetails);
          return;
        }
        dataDetails.details.push(MasterFileMessagesEnum.SUCCESSFUL);
        details.push(dataDetails);

        const {
          competencyUID,
          competencyName,
          competencyDescription,
          skillName,
          skillUID,
          skillDescription,
          topicUID,
          topicName,
          topicDescription,
          comment,
        } = data;

        const competencyToSave = {
          id: undefined,
          name: competencyName,
          uid: competencyUID,
          description: competencyDescription,
        };

        const skillToSave = {
          id: undefined,
          name: skillName,
          uid: skillUID,
          description: skillDescription,
        };

        const topicToSave = {
          id: undefined,
          uid: topicUID,
          name: topicName,
          description: topicDescription,
          comments: comment,
        };
        return { competencyToSave, skillToSave, topicToSave };
      },
    );

    const filteredData = filterData.filter(Boolean);
    this.saveData(filteredData, userId, knowledgeAreaId, evaluationRolesIds);
    return returnFileDetailsOrThrowException(details, 'data');
  }

  async saveData(
    data: IMasterFileDataToSave[],
    userId: number,
    knowledgeAreaId: number,
    evaluationRolesIds: number[],
  ) {
    const skillNames: string[] = [];
    const competencyNames: string[] = [];

    for (const { competencyToSave, skillToSave, topicToSave } of data) {
      const topic = await this.topicService.createOneWithoutRelations({
        ...topicToSave,
      });

      let skill: Skill;
      const skillAlreadyCreated = skillNames.includes(skillToSave.name);
      if (skillAlreadyCreated) {
        const [skillToUpdate] = await this.skillService.findManyByUIDs([
          skillToSave.uid,
        ]);
        const topicsIds = skillToUpdate.topics.map((topic) => topic.id);
        topicsIds.push(topic.id);
        const updateSkillDto = {
          ...skillToUpdate,
          topicsIds,
        };
        skill = await this.skillService.updateOne(
          skillToUpdate.id,
          updateSkillDto,
          userId,
        );
      } else {
        skill = await this.skillService.createOne({
          ...skillToSave,
          topicsIds: [topic.id],
        });
        skillNames.push(skillToSave.name);
      }
      const competencyAlreadyCreated = competencyNames.includes(
        competencyToSave.name,
      );
      if (competencyAlreadyCreated) {
        const competencyToUpdate = await this.competencyService.findOneByUID(
          competencyToSave.uid,
        );
        const skillsUIDs = competencyToUpdate.skills.map((skill) => skill.uid);
        const skillAlreadyRelated = skillsUIDs.includes(skillToSave.uid);
        if (!skillAlreadyRelated) {
          const skillsIds = competencyToUpdate.skills.map((skill) => skill.id);
          skillsIds.push(skill.id);
          const updateCompetencyDto: UpdateCompetencyDto = {
            ...competencyToUpdate,
            skillsIds,
            knowledgeAreaId,
            evaluationRolesIds,
          };
          await this.competencyService.updateOne(
            competencyToUpdate.id,
            updateCompetencyDto,
            userId,
          );
        }
      } else {
        await this.competencyService.createOneWithSkill(
          competencyToSave,
          userId,
          skill,
          knowledgeAreaId,
          evaluationRolesIds,
        );
        competencyNames.push(competencyToSave.name);
      }
    }
  }
}
