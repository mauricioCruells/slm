import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';
import { AuthorizedRoles, AuthUser, User } from '@Auth/decorators';
import { MultipleResponse, PaginationDto } from '@Core/dto';
import { ApiPaginatedResponse } from '@Core/decorators';
import { serializeMultipleResponse } from '@Core/utils';
import { UserRole } from '@Role/enums';

import { AssessmentService } from '../services';
import { AssessmentDoc } from '../docs';

@ApiTags('Assessment management endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @AuthorizedRoles(UserRole.ALL)
  @ApiPaginatedResponse(AssessmentDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve the assessments',
    summary: 'Get assessments',
  })
  @Get()
  async getAssessments(
    @Query() pagination: PaginationDto,
    @User() user: AuthUser,
  ): Promise<MultipleResponse<AssessmentDoc[]>> {
    const [assessments, total] = await this.assessmentService.findAll(
      pagination,
      user,
    );
    return serializeMultipleResponse(
      AssessmentDoc,
      assessments,
      pagination,
      total,
      false,
    );
  }
}
