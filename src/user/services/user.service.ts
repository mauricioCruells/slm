import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { In } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { PaginationDto, IdParamDto } from '@Core/dto';
import { StatusEnum } from '@Core/enums';
import {
  flattenValidationErrors,
  indexEntitiesInArray,
  notFoundByIdMessage,
  retrieveDataFromCsvFile,
  returnFileDetailsOrThrowException,
} from '@Core/utils';
import { RoleService } from '@Role/services';
import { EvaluationRoleService } from '@Evaluation-Role/services';
import { SeniorityLevelService } from '@Seniority-Level/services';
import { UserRole } from '@Role/enums';
import { AuthUser } from '@Auth/decorators';
import { ReportQueryDto } from '@Report/dto';

import { User } from '../entities';
import { UserRepository } from '../repositories';
import { UpdateUserDto, UserFile, UserParamDto } from '../dto';
import { UserFileDetailsDoc } from '../docs';
import { FileStatusEnum, UsersFileMessagesEnum } from '../enums';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RoleService,
    private readonly evaluationRoleService: EvaluationRoleService,
    private readonly seniorityLevelService: SeniorityLevelService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(pagination: PaginationDto): Promise<[User[], number]> {
    return this.userRepository.getAllUsers(pagination);
  }

  async findOneByEmail(filter: UserParamDto): Promise<User> {
    const user = await this.userRepository.getOneByEmail(filter);

    if (!user)
      throw new NotFoundException(
        `User with email: ${filter.email} was not found`,
      );
    return user;
  }

  async findByEmail(filter: UserParamDto): Promise<User[]> {
    const users = await this.userRepository.getByEmail(filter);

    if (!users.length)
      throw new NotFoundException(
        `Users with email: ${filter.email} were not found`,
      );

    return users;
  }

  async findOneById(id: number, loggedUser?: AuthUser): Promise<User> {
    const user = await this.userRepository.getOneById(id);

    if (!user) throw new NotFoundException(notFoundByIdMessage('User', id));
    if (loggedUser) {
      const loggedUserFound = await this.userRepository.getOneById(
        loggedUser.sub,
      );

      if (
        loggedUserFound.role.name === UserRole.INTERVIEWEE &&
        loggedUser.sub !== id
      ) {
        throw new ForbiddenException('You do not have enough privileges');
      }
    }

    return user;
  }

  async findManyForReport(reportQuery: ReportQueryDto): Promise<User[]> {
    const users = await this.userRepository.findManyForReport(reportQuery);
    if (!users.length)
      throw new NotFoundException(
        `Users with filters: ${reportQuery} were not found`,
      );

    return users;
  }

  async disableUser(idParamDto: IdParamDto): Promise<User> {
    const user = await this.userRepository.getOneById(idParamDto.id);

    if (!user)
      throw new NotFoundException(notFoundByIdMessage('User', idParamDto.id));

    if (user.status === StatusEnum.INACTIVE)
      throw new BadRequestException(
        `User with ID ${idParamDto.id} is already disabled`,
      );

    await this.eventEmitter.emitAsync(
      'auth.token.deleteByUserId',
      idParamDto.id,
    );
    user.status = StatusEnum.INACTIVE;
    return await this.userRepository.save(user);
  }

  async uploadFileAndSave(
    file: Express.Multer.File,
  ): Promise<UserFileDetailsDoc[]> {
    const plainUsers = await retrieveDataFromCsvFile(file);

    if (!plainUsers.length)
      throw new BadRequestException(
        'There are no users included in the uploaded file',
      );

    const serializedUsersFile = plainToInstance(UserFile, {
      users: plainUsers,
    });
    const validationErrors = await validate(serializedUsersFile, {
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
    });
    if (validationErrors.length) {
      throw new BadRequestException(flattenValidationErrors(validationErrors));
    }

    const { employeeIDs, emails, evaluationRoles, seniorityLevels } =
      serializedUsersFile.users.reduce(
        (
          acc,
          { employeeID, email, evaluationRoleName, seniorityLevelName },
        ) => {
          acc.employeeIDs.push(employeeID);
          acc.emails.push(email);
          acc.evaluationRoles.push(evaluationRoleName);
          acc.seniorityLevels.push(seniorityLevelName);
          return acc;
        },
        {
          employeeIDs: [] as string[],
          emails: [] as string[],
          evaluationRoles: [] as string[],
          seniorityLevels: [] as string[],
        },
      );

    const platformRoles = await this.roleService.findAll();

    const filteredEmails = [...new Set(emails)];
    const filteredEmployeeIDs = [...new Set(employeeIDs)];

    const setEvaluationRoles = [...new Set(evaluationRoles)];
    const filteredEvaluationRoles = setEvaluationRoles.filter(Boolean);

    const setSeniorityLevels = [...new Set(seniorityLevels)];
    const filteredSeniorityLevels = setSeniorityLevels.filter(Boolean);

    const existingEmails = await this.userRepository.findManyBy({
      where: { email: In(filteredEmails) },
    });

    const existingEmployeeIDs = await this.userRepository.findManyBy({
      where: { employeeID: In(filteredEmployeeIDs) },
    });

    const existingEvaluationRoles =
      filteredEvaluationRoles.length > 0
        ? await this.evaluationRoleService.findManyByName(
            filteredEvaluationRoles,
          )
        : [];

    const existingSeniorityLevels =
      await this.seniorityLevelService.findByFilters({
        where: { name: In(filteredSeniorityLevels) },
      });

    const { flattenedEmails } = existingEmails.reduce(
      (acc, currentEmail) => {
        acc.flattenedEmails.push(currentEmail.email);
        return acc;
      },
      { flattenedEmails: [] as string[] },
    );

    const { flattenedEmployeeIDs } = existingEmployeeIDs.reduce(
      (acc, currentEmployeeID) => {
        acc.flattenedEmployeeIDs.push(currentEmployeeID.employeeID);
        return acc;
      },
      { flattenedEmployeeIDs: [] as string[] },
    );

    const indexedEvaluationRoles = indexEntitiesInArray(
      existingEvaluationRoles,
    );

    const indexedSeniorityLevels = indexEntitiesInArray(
      existingSeniorityLevels,
    );

    const details: UserFileDetailsDoc[] = [];

    const filterUsers = serializedUsersFile.users.map((user) => {
      const platformRole = user.platformRoleName
        ? user.platformRoleName
        : 'Interviewee';
      const joiningDate = user.joiningDate.toISOString().substring(0, 10);

      const userDetails = {
        name: `${user.firstName} ${user.lastName}`,
        employeeID: user.employeeID,
        email: user.email,
        platformRole,
        evaluationRole: user.evaluationRoleName
          ? user.evaluationRoleName
          : null,
        seniorityLevel: user.seniorityLevelName
          ? user.seniorityLevelName
          : null,
        joiningDate,
        result: FileStatusEnum.UPLOADED,
        details: [],
      };
      const isAlreadyInFile = details?.filter((userDetailed) => {
        return (
          (userDetailed.employeeID === userDetails.employeeID ||
            userDetailed.email === userDetails.email) &&
          userDetailed.result === FileStatusEnum.UPLOADED
        );
      });
      if (
        flattenedEmails.includes(user.email) ||
        flattenedEmployeeIDs.includes(user.employeeID) ||
        isAlreadyInFile.length
      ) {
        userDetails.details.push(UsersFileMessagesEnum.DUPLICATED);
      }

      const role = platformRoles.find((role) => role.name === platformRole);

      if (!role)
        userDetails.details.push(UsersFileMessagesEnum.INVALID_PLATFORM_ROLE);

      const currentDate = new Date();
      if (new Date(joiningDate) > currentDate)
        userDetails.details.push(UsersFileMessagesEnum.INVALID_DATE);

      const userConstructor = {
        ...user,
        joiningDate,
        role,
        id: undefined,
        evaluationRole: null,
        seniorityLevel: null,
      };

      if (user.evaluationRoleName) {
        const evaluationRoleId =
          indexedEvaluationRoles[user.evaluationRoleName];
        if (!evaluationRoleId) {
          userDetails.details.push(
            UsersFileMessagesEnum.INVALID_EVALUATION_ROLE,
          );
        }
        userConstructor.evaluationRole = { id: evaluationRoleId };
      }

      if (user.seniorityLevelName) {
        const seniorityLevelId =
          indexedSeniorityLevels[user.seniorityLevelName];
        seniorityLevelId
          ? (userConstructor.seniorityLevel = { id: seniorityLevelId })
          : userDetails.details.push(
              UsersFileMessagesEnum.INVALID_SENIORITY_LEVEL,
            );
      }
      const userHasErrors = userDetails.details.length;
      if (userHasErrors) {
        userDetails.result = FileStatusEnum.ERROR;
        details.push(userDetails);
        return;
      }
      userDetails.details.push(UsersFileMessagesEnum.SUCCESSFUL);
      details.push(userDetails);

      return userConstructor;
    });

    const usersToSave = filterUsers.filter(Boolean);

    if (usersToSave.length) {
      await this.userRepository.save(usersToSave);
    }
    return returnFileDetailsOrThrowException(details, 'users');
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    const roleName = updateUserDto.role;
    if (roleName) {
      const role = await this.roleService.findOneBy({
        where: { name: roleName },
      });
      if (!role) throw new NotFoundException(`Role not found`);
      user.role = role;
    }
    const evaluationRoleName = updateUserDto.evaluationRole;
    if (evaluationRoleName) {
      const evaluationRole = await this.evaluationRoleService.findOneByName(
        evaluationRoleName,
      );
      if (!evaluationRole) {
        throw new NotFoundException(`Evaluation Role not found`);
      }
      user.evaluationRole = evaluationRole;
    }
    const seniorityLevelName = updateUserDto.seniorityLevel;
    if (seniorityLevelName) {
      const seniorityLevel = await this.seniorityLevelService.findByFilters({
        where: { name: seniorityLevelName },
      });
      if (!seniorityLevel) {
        throw new NotFoundException('Seniority level not found');
      }
      user.seniorityLevel = seniorityLevel[0];
    }
    const email = updateUserDto.email;
    if (email) {
      const existingEmail = await this.userRepository.getOneByEmail({
        email,
      });
      if (existingEmail) {
        throw new BadRequestException('Email already belongs to other user');
      }
    }
    const employeeID = updateUserDto.employeeID;
    if (employeeID) {
      const existingEmployeeID = await this.userRepository.findOneByEmployeeId(
        updateUserDto.employeeID,
      );
      if (existingEmployeeID) {
        throw new BadRequestException(
          'Employee ID already belongs to other user',
        );
      }
    }
    const { evaluationRole, role, seniorityLevel } = user;
    const updatedUser = {
      ...user,
      ...updateUserDto,
      evaluationRole,
      role,
      seniorityLevel,
    };
    return this.userRepository.save(updatedUser);
  }
}
