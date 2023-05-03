import { UserWithCompletion } from '@Report/enums';
import { User } from '@User/entities';

export function calculatePercentageOfCompletion(
  usersWithoutCompletion: User[],
): UserWithCompletion[] {
  return usersWithoutCompletion.map((user: User) => {
    const percentageOfCompletion =
      user.assessments.length > 0
        ? user.completedAssessments.length / user.assessments.length
        : 0;

    return { ...user, percentageOfCompletion };
  });
}
