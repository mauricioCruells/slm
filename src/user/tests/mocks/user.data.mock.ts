import { StatusEnum } from '@Core/enums';
import { intervieweeRoleMock } from '@Role/tests/mocks';
import { User } from '@User/entities';
import { AuthUser } from '@Auth/decorators';

export const intervieweeDataMock: User = {
  id: 1,
  employeeID: 'FTE-ES001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'jdoe@contoso.com',
  createdAt: new Date('02/02/2022'),
  joiningDate: '01/02/2022',
  status: StatusEnum.ACTIVE,
  role: intervieweeRoleMock,
  evaluationRole: null,
  seniorityLevel: null,
  evaluationRoleHistory: [],
  tokens: [],
  competencies: [],
  questions: [],
  assessments: [],
  reports: [],
  completedAssessments: [],
};

export const authUserMock: AuthUser = {
  sub: 1,
  username: 'jdoe@contoso.com',
  role: 'Interviewee',
  uti: '',
};
