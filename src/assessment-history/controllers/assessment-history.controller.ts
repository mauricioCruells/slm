import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthorizedRoles } from '@Auth/decorators';
import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';
import { IdParamDto, MultipleResponse } from '@Core/dto';
import { UserRole } from '@Role/enums';
import { AssessmentHistoryService } from '@AssessmentHistory/services';
import { ApiArrayStringResponse } from '@Core/decorators';

@ApiTags('Assessment History log endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('assessments')
export class AssessmentHistoryController {
  constructor(
    private readonly assessmentHistoryService: AssessmentHistoryService,
  ) {}

  @ApiArrayStringResponse()
  @ApiOperation({
    description: 'Use this endpoint to retrieve the log of an assessment',
    summary: 'Get assessment history',
  })
  @Get(':id/history')
  async getCompetencies(
    @Param() idParam: IdParamDto,
  ): Promise<MultipleResponse<string[]>> {
    const assessmentLogs =
      await this.assessmentHistoryService.findByAssessmentId(idParam.id);

    return {
      data: assessmentLogs,
    };
  }
}
