import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '@User/entities';
import { AuthUser } from '@Auth/decorators';
import { UserRole } from '@Role/enums';

import { ReportQueryDto } from '../dto';
import { ReportRepository } from '../repositories';
import { calculatePercentageOfCompletion, sortByCompletion } from '../utils';
import { SortFieldEnum } from '../enums';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async generateInterviewees(reportQuery: ReportQueryDto, user: AuthUser) {
    // extract completion sort option
    const completionSortOption = reportQuery.sort.find(
      (sortOption) => sortOption.sortField === SortFieldEnum.COMPLETION,
    );
    reportQuery.sort = reportQuery.sort.filter(
      (sortOption) => sortOption.sortField !== SortFieldEnum.COMPLETION,
    );

    if (user.role === UserRole.INTERVIEWEE) {
      reportQuery = { ...reportQuery, userIds: [user.sub] };
    }

    //generate the interviewees list with filter and sorts
    const [interviewees] = await this.eventEmitter.emitAsync(
      'report.getManyUsersByQuery',
      reportQuery,
    );

    const allAreUsers = interviewees.every(
      (interviewee: unknown) => interviewee instanceof User,
    );

    if (!allAreUsers) {
      throw new UnprocessableEntityException(
        'Something went wrong while querying interviewees, please try again',
      );
    }

    let intervieweesWithCompletion =
      calculatePercentageOfCompletion(interviewees);

    // final sort by completion
    if (user.role !== UserRole.INTERVIEWEE) {
      intervieweesWithCompletion = sortByCompletion(
        intervieweesWithCompletion,
        completionSortOption ? completionSortOption.sortOrder : 'ASC',
      );
    }

    return {
      interviewees: intervieweesWithCompletion,
    };
  }
}
