import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser, AuthorizedRoles, User } from '@Auth/decorators';
import { JwtGuard, AccessTokenGuard, RoleGuard } from '@Auth/guards';
import { UserRole } from '@Role/enums';
import { ApiSingleResponse } from '@Core/decorators';
import { serializeResponse } from '@Core/utils';

import { ReportService } from '../services';
import { ReportQueryDto } from '../dto';
import { IntervieweesDoc } from '../docs';
import { ReportApiParams } from '../constants';

@ApiTags('Results and Reports endpoints')
@ApiBearerAuth()
@UseGuards(JwtGuard, AccessTokenGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER, UserRole.INTERVIEWEE)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiSingleResponse(IntervieweesDoc)
  @ApiOperation({
    description: ReportApiParams.generateReportEPDescription,
    summary: ReportApiParams.generateReportEPSummary,
  })
  @Get('interviewees')
  async generate(@Query() reportQuery: ReportQueryDto, @User() user: AuthUser) {
    const excludeNestedProperties = false;

    const interviewees = await this.reportService.generateInterviewees(
      reportQuery,
      user,
    );

    return serializeResponse(
      IntervieweesDoc,
      interviewees,
      excludeNestedProperties,
    );
  }
}
