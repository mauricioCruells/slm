import { AuthUser } from '@Auth/decorators';
import { PaginationDto } from '@Core/dto';
import { StatusEnum } from '@Core/enums';
import { intervieweeRoleMock, interviewerRoleMock } from '@Role/tests/mocks';
import { User } from '@User/entities';

export const paginationDtoMock: PaginationDto = {
  page: 1,
  items: 20,
};

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

export const interviewerDataMock: User = {
  id: 1,
  employeeID: 'FTE-ES002',
  firstName: 'Michael',
  lastName: 'Karls',
  email: 'mkarls@contoso.com',
  createdAt: new Date('02/02/2022'),
  joiningDate: '01/02/2022',
  status: StatusEnum.INACTIVE,
  role: interviewerRoleMock,
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
  role: 'Interviewee',
  username: 'jdoe@contoso.com',
  uti: '',
};

export const loggedInterviewerInformationDtoMock: AuthUser = {
  sub: 1,
  role: 'Interviewer',
  username: 'mkarl@contoso.com',
  uti: '',
};

export const paginatedUsers = {
  data: [intervieweeDataMock, interviewerDataMock],
  pagination: {
    current_page: 1,
    items_per_page: 20,
    total_items: 2,
    total_pages: 1,
    previous_page: null,
    next_page: null,
  },
};
