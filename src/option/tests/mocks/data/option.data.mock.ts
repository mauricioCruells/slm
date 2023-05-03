import { question } from '@Question/tests/mocks/data';

import { CreateOptionDto } from '@Option/dto';
import { Option } from '@Option/entities';

export const correctAnswerPolymorphism: Option = {
  id: 1,
  value:
    'It is a core concept of OOP and describes situations in which something occurs in several different forms',
  isCorrect: true,
  question: question,
};

export const incorrectAnswerPolymorphism: Option = {
  id: 2,
  value:
    'It is a principle that says that a class should have a single responsibility',
  isCorrect: false,
  question: question,
};

export const createCorrectPolymorphismAnswerDto: CreateOptionDto = {
  value:
    'It is a core concept of OOP and describes situations in which something occurs in several different forms',
  isCorrect: true,
  questionId: 1,
};
