import { StatusEnum } from '@Core/enums';
import { levelOne } from '@Seniority-Level/tests/mocks';
import { Topic } from '@Topic/entities';

export const oop: Topic = {
  id: 1,
  uid: 'uid',
  name: 'Object Oriented Programming',
  description: 'OOP',
  updatedAt: new Date('10/10/2021'),
  status: StatusEnum.ACTIVE,
  skill: null,
  questions: [],
};
