import { QuestionTypeEnum } from '@Core/enums';
import {
  correctAnswerPolymorphism,
  incorrectAnswerPolymorphism,
} from '@Option/tests/mocks/data';
import { levelOne } from '@Seniority-Level/tests/mocks';
import { interviewerDataMock } from '@User/tests/mocks/data';

import { CreateQuestionDto } from '@Question/dto';
import { Question } from '@Question/entities';

export const question: Question = {
  id: 0,
  question: 'What Is Polymorphism?',
  description: 'Question about OPP',
  type: QuestionTypeEnum.MULTIPLE_CHOICE,
  score: 3,
  time: 90,
  options: [correctAnswerPolymorphism, incorrectAnswerPolymorphism],
  level: levelOne,
  author: interviewerDataMock,
  topic: null,
  isActive: true,
  lastUpdated: undefined,
  deletedDate: undefined,
  createdDate: undefined,
};

export const createQuestionDtoDataMock: CreateQuestionDto = {
  question: 'What Is Polymorphism?',
  description: 'Question about OPP',
  type: QuestionTypeEnum.MULTIPLE_CHOICE,
  score: 3,
  time: 90,
  levelId: 1,
  topicId: 1,
  isActive: true,
};
