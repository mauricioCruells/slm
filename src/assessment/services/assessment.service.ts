import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AuthUser } from '@Auth/decorators';
import { PaginationDto } from '@Core/dto';
import { EvaluationRoleService } from '@Evaluation-Role/services';
import { UserRole } from '@Role/enums';
import { User } from '@User/entities';

import { AssessmentRepository } from '../repositories';
import { Assessment } from '../entities';

@Injectable()
export class AssessmentService {
  constructor(
    private readonly assessmentRepository: AssessmentRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly evaluationRoleService: EvaluationRoleService,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    loggedUser: AuthUser,
  ): Promise<[Assessment[], number]> {
    const userIsInterviewee = loggedUser.role === UserRole.INTERVIEWEE;
    if (userIsInterviewee) {
      const [user]: unknown[] = await this.eventEmitter.emitAsync(
        'assessment.getOneUserById',
        loggedUser.sub,
      );
      if (user instanceof User) {
        const evaluationRole = await this.evaluationRoleService.findOneByName(
          user.evaluationRole.name,
        );
        const assessmentsAndCount =
          await this.assessmentRepository.getManyByEvaluationRole(
            paginationDto,
            evaluationRole,
          );
        return assessmentsAndCount;
      }
    }
    const assessmentsAndCount = await this.assessmentRepository.getAll(
      paginationDto,
    );
    return assessmentsAndCount;
  }
}
