import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthorizedRoles } from '@Auth/decorators';
import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';
import { ApiArrayResponse, ApiSingleResponse } from '@Core/decorators';
import { IdParamDto, MultipleResponse, SingleResponse } from '@Core/dto';
import { serializeMultipleResponse, serializeResponse } from '@Core/utils';

import { UserRole } from '../enums';
import { RoleService } from '../services';
import { RoleDoc } from '../docs';
import { UpdateRoleDto } from '../dtos';

@ApiTags('Platform Roles management endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@Controller('platform-roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
  @ApiArrayResponse(RoleDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve the platform roles',
    summary: 'Get platform roles',
  })
  @Get()
  async getRoles(): Promise<MultipleResponse<RoleDoc[]>> {
    const roles = await this.roleService.findAll();
    return serializeMultipleResponse(RoleDoc, roles);
  }

  @AuthorizedRoles(UserRole.ADMIN)
  @ApiSingleResponse(RoleDoc)
  @ApiOperation({
    description: 'Use this endpoint to update a platform role',
    summary: 'Update platform roles',
  })
  @Patch(':id')
  async update(
    @Param() id: IdParamDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<SingleResponse<RoleDoc>> {
    const updatedRole = await this.roleService.updateOne(id.id, updateRoleDto);
    return serializeResponse(RoleDoc, updatedRole);
  }
}
