import { StatusEnum } from '@Core/enums';
import { Role } from '@Role/entities';

export const intervieweeRoleMock: Role = {
  id: 1,
  name: 'Interviewee',
  alias: 'Interviewee',
  description: 'SML Role for Interviewee',
  status: StatusEnum.ACTIVE,
  users: [],
};

export const interviewerRoleMock: Role = {
  id: 2,
  name: 'Interviewer',
  alias: 'Interviewer',
  description: 'SML Role for Interviewer',
  status: StatusEnum.ACTIVE,
  users: [],
};

export const adminRoleMock: Role = {
  id: 2,
  name: 'Admin',
  alias: 'Admin',
  description: 'SML Role for Admin',
  status: StatusEnum.ACTIVE,
  users: [],
};
