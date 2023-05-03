import { User } from '@User/entities';

export type UserWithCompletion = User & {
  percentageOfCompletion: number;
};
