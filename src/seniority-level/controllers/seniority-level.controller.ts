import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';
import { serializeMultipleResponse } from '@Core/utils';
import { ApiArrayResponse } from '@Core/decorators';
import { MultipleResponse } from '@Core/dto';
import { AuthorizedRoles } from '@Auth/decorators';
import { UserRole } from '@Role/enums';

import { SeniorityLevelService } from '../services';
import { SeniorityLevelDoc } from '../docs';

@ApiTags('Seniority Level management endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@Controller('seniority-level')
export class SeniorityLevelController {
  constructor(private readonly seniorityLevelService: SeniorityLevelService) {}

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiArrayResponse(SeniorityLevelDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve the seniority levels',
    summary: 'Get seniority levels',
  })
  @Get()
  async findALl(): Promise<MultipleResponse<SeniorityLevelDoc[]>> {
    const seniorityLevels = await this.seniorityLevelService.findAll();
    return serializeMultipleResponse(SeniorityLevelDoc, seniorityLevels);
  }
}
