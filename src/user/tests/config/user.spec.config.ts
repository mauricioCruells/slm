import { getRepositoryToken } from '@nestjs/typeorm';
import { EvaluationRoleService } from '@Evaluation-Role/services';
import { RoleService } from '@Role/services';
import { SeniorityLevelService } from '@Seniority-Level/services';
import { UserRepository } from '@User/repositories';
import { UserService } from '@User/services';
import { UserRepositoryValueMock } from '@User/tests/mocks/repositories/user.repository.mock';

export const userServiceTestingModuleConfig = {
  providers: [
    UserService,
    {
      provide: RoleService,
      useValue: {
        findOne: jest.fn(),
      },
    },
    {
      provide: SeniorityLevelService,
      useValue: {
        // Add functions
      },
    },
    {
      provide: getRepositoryToken(UserRepository),
      useValue: UserRepositoryValueMock(),
    },
    {
      provide: EvaluationRoleService,
      useValue: {
        // Add functions
      },
    },
  ],
};
