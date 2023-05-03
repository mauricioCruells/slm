export enum SortFieldEnum {
  FIRST_NAME = 'user.firstName',
  LAST_NAME = 'user.lastName',
  EMAIL = 'user.email',
  EVALUATION_ROLE = 'evaluationRole.name',
  SENIORITY_LEVEL = 'seniorityLevel.name',
  COMPLETION = 'completion',
}

export const sortFieldMapping = {
  firstName: SortFieldEnum.FIRST_NAME,
  lastName: SortFieldEnum.LAST_NAME,
  email: SortFieldEnum.EMAIL,
  evaluationRole: SortFieldEnum.EVALUATION_ROLE,
  seniorityLevel: SortFieldEnum.SENIORITY_LEVEL,
  completion: SortFieldEnum.COMPLETION,
};
