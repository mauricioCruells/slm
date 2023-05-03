import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthUser, User } from '@Auth/decorators';
import { AccessTokenGuard, JwtGuard } from '@Auth/guards';
import { ApiSingleResponse, ExcludeWhenNotDev } from '@Core/decorators';
import { SingleResponse } from '@Core/dto';
import { serializeResponse } from '@Core/utils';

import { RoleChangedUserDoc } from '../docs';
import { RoleDto } from '../dtos';
import { RoleChangingUserGuard } from '../guards';
import { InternalEndpointsService } from '../services';

@ApiTags('Internal Endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard)
@Controller('internal')
export class InternalEndpointsController {
  constructor(
    private readonly internalEndpointsService: InternalEndpointsService,
  ) {}

  @UseGuards(RoleChangingUserGuard)
  @ApiSingleResponse(RoleChangedUserDoc)
  @ApiOperation({
    description: 'Use this endpoint to change your role',
    summary: 'Change your internal role',
  })
  @ApiBody({ type: RoleDto })
  @Put('change-role')
  @ExcludeWhenNotDev()
  async changeRole(
    @Body() role: RoleDto,
    @User() user: AuthUser,
  ): Promise<SingleResponse<RoleChangedUserDoc>> {
    const updatedUser = await this.internalEndpointsService.changeRole(
      user,
      role,
    );

    return serializeResponse(RoleChangedUserDoc, updatedUser);
  }
}
