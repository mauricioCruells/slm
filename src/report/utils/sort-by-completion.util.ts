import { UserWithCompletion } from '../enums';

export function sortByCompletion(
  usersWithCompletion: UserWithCompletion[],
  order: string,
): UserWithCompletion[] {
  return usersWithCompletion.sort((a, b) => {
    return order === 'ASC'
      ? a.percentageOfCompletion - b.percentageOfCompletion
      : b.percentageOfCompletion - a.percentageOfCompletion;
  });
}
