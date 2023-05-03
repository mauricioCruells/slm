import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import {
  flattenValidationErrors,
  notFoundByIdMessage,
  retrieveDataFromCsvFile,
  returnFileDetailsOrThrowException,
} from '@Core/utils';
import { ExampleFilesSlug, FileStatusEnum } from '@Core/enums';
import { PaginationDto } from '@Core/dto';
import { UserService } from '@User/services';
import { SeniorityLevelService } from '@Seniority-Level/services';
import { SeniorityLevel } from '@Seniority-Level/entities';
import { TopicService } from '@Topic/services';
import { AuthUser } from '@Auth/decorators';
import { SkillService } from '@Skill/services';
import {
  ImageFileService,
  S3ExampleFilesService,
  S3FileService,
} from '@S3File/services';

import { QuestionsFileDetailsDoc } from '../doc';
import { QuestionsFileMessagesEnum } from '../enums';
import { CreateQuestionDto, QuestionsFileDto, UpdateQuestionDto } from '../dto';
import { Question } from '../entities';
import { QuestionRepository } from '../repositories';

@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly userService: UserService,
    private readonly seniorityLevelService: SeniorityLevelService,
    private readonly topicService: TopicService,
    private readonly skillService: SkillService,
    private readonly eventEmitter: EventEmitter2,
    private readonly imageFileService: ImageFileService,
    private readonly s3ExampleFilesService: S3ExampleFilesService,
    private readonly s3FileService: S3FileService,
  ) {}

  async getExampleFile(): Promise<GetObjectCommandOutput> {
    const fileDetails = await this.s3ExampleFilesService.getExampleFileBySlug(
      ExampleFilesSlug.QUESTIONS_FILE,
    );

    if (!fileDetails) {
      throw new NotFoundException('Question Example file not found');
    }

    return fileDetails;
  }

  async create(
    createQuestionDto: CreateQuestionDto,
    authUser: AuthUser,
  ): Promise<Question> {
    const { levelId, topicId, ...questionBody } = createQuestionDto;
    const author = await this.userService.findOneById(authUser.sub);
    const level = await this.seniorityLevelService.findOneById(levelId);
    const topic = await this.topicService.findOneById(topicId);
    const createQuestion = this.questionRepository.create({
      ...questionBody,
      author,
      level,
      topic,
    });
    const saveQuestion = await this.questionRepository.save(createQuestion);
    return saveQuestion;
  }

  async findAll(pagination: PaginationDto): Promise<[Question[], number]> {
    const questions = await this.questionRepository.findAll(pagination);
    return questions;
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.getOneById(id);
    if (!question) {
      throw new NotFoundException(notFoundByIdMessage('Question', id));
    }

    if (question.image) {
      const newUrl = await this.s3FileService.generatePresignedUrl(
        question.image.name,
      );

      question.image.url = newUrl;
    }

    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    userId: number,
  ): Promise<Question> {
    const question = await this.findOne(id);
    const updatedQuestion = { ...question, ...updateQuestionDto };
    if (updateQuestionDto.levelId) {
      const [seniorityLevel]: unknown[] = await this.eventEmitter.emitAsync(
        'question.seniorityLevelId',
        updateQuestionDto.levelId,
      );
      if (seniorityLevel instanceof SeniorityLevel) {
        updatedQuestion.level = seniorityLevel;
      }
    }
    const saveUpdatedQuestion = await this.questionRepository.save(
      updatedQuestion,
    );

    this.eventEmitter.emit(
      'assessmentHistory.question.update',
      updatedQuestion.id,
      userId,
    );

    return saveUpdatedQuestion;
  }

  async remove(id: number): Promise<void> {
    const question = await this.findOne(id);
    await this.questionRepository.disableQuestion(question.id);
  }

  async uploadQuestionsFile(
    file: Express.Multer.File,
    userID: number,
    skillId: number,
  ) {
    const skill = await this.skillService.findOneById(skillId);
    const topicIdsFromSkill = skill.topics.map((topic) => topic.id);

    const plainData = await retrieveDataFromCsvFile(file);
    if (!plainData.length)
      throw new BadRequestException(
        'There is no data included in the uploaded file',
      );

    const serializedQuestionsFile = plainToInstance(QuestionsFileDto, {
      questions: plainData,
    });

    const validationErrors = await validate(serializedQuestionsFile, {
      whitelist: true,
      stopAtFirstError: false,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length) {
      const flattenedValidationErrors =
        flattenValidationErrors(validationErrors);
      const informationWithoutDoubleQuotes = flattenedValidationErrors.some(
        (message) =>
          message.includes('__EMPTY') && message.includes('should not exist'),
      );
      if (informationWithoutDoubleQuotes) {
        const finalValidationErrors = flattenedValidationErrors.map(
          (message) => {
            return message.replace(
              '.property __EMPTY should not exist',
              ' question, description, correctAnswer and options must start and end with double quotes',
            );
          },
        );
        throw new BadRequestException(finalValidationErrors);
      } else {
        throw new BadRequestException(flattenedValidationErrors);
      }
    }

    const { questions } = serializedQuestionsFile.questions.reduce(
      (acc, { question, seniorityLevel, topicName }) => {
        acc.questions.push(question);
        acc.seniorityLevels.push(seniorityLevel);
        acc.topicNames.push(topicName);

        return acc;
      },
      {
        questions: [] as string[],
        seniorityLevels: [] as string[],
        topicNames: [] as string[],
      },
    );
    const filteredQuestions = [...new Set(questions)];
    const existingQuestions = await this.questionRepository.findManyQuestions(
      filteredQuestions,
    );
    const { flattenedExistingQuestions } = existingQuestions.reduce(
      (acc, currentQuestion) => {
        acc.flattenedExistingQuestions.push({
          question: currentQuestion.question,
          topicUid: currentQuestion.topic.uid,
        });
        return acc;
      },
      {
        flattenedExistingQuestions: [] as {
          question: string;
          topicUid: string;
        }[],
      },
    );

    const details: QuestionsFileDetailsDoc[] = [];
    for (const currentQuestion of serializedQuestionsFile.questions) {
      const questionDetails: QuestionsFileDetailsDoc = {
        id: undefined,
        question: currentQuestion.question,
        description: currentQuestion.description,
        type: currentQuestion.type,
        score: currentQuestion.score,
        time: currentQuestion.time,
        seniorityLevel: currentQuestion.seniorityLevel,
        topicUid: currentQuestion.topicUid,
        topicName: currentQuestion.topicName,
        option1: currentQuestion.option1,
        option1IsCorrect: currentQuestion.option1IsCorrect === 'true',
        option2: currentQuestion.option2,
        option2IsCorrect: currentQuestion.option2IsCorrect === 'true',
        option3: currentQuestion.option3,
        option3IsCorrect: currentQuestion.option3IsCorrect === 'true',
        option4: currentQuestion.option4,
        option4IsCorrect: currentQuestion.option4IsCorrect === 'true',
        result: FileStatusEnum.UPLOADED,
        details: [],
      };

      const questionAlreadyInFile = details?.filter((dataDetailed) => {
        return (
          dataDetailed.question.toLowerCase().trim() ===
            questionDetails.question.toLowerCase().trim() &&
          dataDetailed.topicUid.toLowerCase().trim() ===
            questionDetails.topicUid.toLowerCase().trim() &&
          dataDetailed.result === FileStatusEnum.UPLOADED
        );
      });
      const questionAlreadyInDB = flattenedExistingQuestions.filter(
        (existingQuestion) => {
          return (
            existingQuestion.question.toLowerCase().trim() ===
              questionDetails.question.toLowerCase().trim() &&
            existingQuestion.topicUid.toLowerCase().trim() ===
              questionDetails.topicUid.toLowerCase().trim()
          );
        },
      );
      if (questionAlreadyInDB.length || questionAlreadyInFile.length) {
        questionDetails.details.push(
          QuestionsFileMessagesEnum.QUESTION_DUPLICATED,
        );
      }

      const [existingSeniorityLevel] =
        await this.seniorityLevelService.findByFilters({
          where: { name: currentQuestion.seniorityLevel },
        });
      if (!existingSeniorityLevel) {
        questionDetails.details.push(
          QuestionsFileMessagesEnum.INVALID_SENIORITY_LEVEL,
        );
      }
      const [existingTopic] = await this.topicService.findManyByUIDs([
        currentQuestion.topicUid,
      ]);
      if (!existingTopic) {
        questionDetails.details.push(
          QuestionsFileMessagesEnum.INVALID_TOPIC_UID,
        );
      } else {
        if (
          existingTopic.name.toLowerCase().trim() !==
          currentQuestion.topicName.toLowerCase().trim()
        ) {
          questionDetails.details.push(
            QuestionsFileMessagesEnum.INVALID_TOPIC_MATCH,
          );
        }
        const topicIsFromDifferentSkill = !topicIdsFromSkill.includes(
          existingTopic.id,
        );

        if (topicIsFromDifferentSkill) {
          questionDetails.details.push(
            QuestionsFileMessagesEnum.INVALID_TOPIC_SKILL,
          );
        }
      }

      if (questionDetails.details.length) {
        questionDetails.result = FileStatusEnum.ERROR;
        details.push(questionDetails);
      } else {
        questionDetails.details.push(QuestionsFileMessagesEnum.SUCCESSFUL);
        details.push(questionDetails);

        const {
          question,
          description,
          score,
          time,
          type,
          option1,
          option1IsCorrect,
          option2,
          option2IsCorrect,
          option3,
          option3IsCorrect,
          option4,
          option4IsCorrect,
        } = currentQuestion;

        const questionToSave = {
          id: undefined,
          question,
          description,
          score,
          level: existingSeniorityLevel,
          topic: existingTopic,
          time,
          type,
          author: { id: userID },
          isActive: true,
        };
        const savedQuestion = await this.questionRepository.save(
          questionToSave,
        );

        // associate id doc property with saved question id
        questionDetails.id = savedQuestion.id;

        const option1ToSave = {
          id: undefined,
          isCorrect: option1IsCorrect === 'true',
          questionId: savedQuestion.id,
          value: option1,
        };
        const option2ToSave = {
          isCorrect: option2IsCorrect === 'true',
          questionId: savedQuestion.id,
          value: option2,
        };
        const option3ToSave = {
          isCorrect: option3IsCorrect === 'true',
          questionId: savedQuestion.id,
          value: option3,
        };
        const option4ToSave = {
          isCorrect: option4IsCorrect === 'true',
          questionId: savedQuestion.id,
          value: option4,
        };
        await Promise.all([
          this.eventEmitter.emitAsync('question.createOption', option1ToSave),
          this.eventEmitter.emitAsync('question.createOption', option2ToSave),
          this.eventEmitter.emitAsync('question.createOption', option3ToSave),
          this.eventEmitter.emitAsync('question.createOption', option4ToSave),
        ]);
      }
    }
    return returnFileDetailsOrThrowException(details, 'questions');
  }

  async addImageToQuestion(
    questionId: number,
    imageFile: Express.Multer.File,
  ): Promise<Question> {
    const question = await this.findOne(questionId);

    const image = await this.imageFileService.uploadImageFile(imageFile);

    const questionWithImage = { ...question, image };

    await this.questionRepository.save(questionWithImage);

    return questionWithImage;
  }
}
