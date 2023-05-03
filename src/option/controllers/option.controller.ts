import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtGuard, AccessTokenGuard, RoleGuard } from '@Auth/guards';
import { AuthorizedRoles } from '@Auth/decorators';
import { UserRole } from '@Role/enums';
import { IdParamDto } from '@Core/dto';

import { CreateOptionDto, UpdateOptionDto } from '../dto';
import { Option } from '../entities';
import { OptionService } from '../services';

@ApiTags('Option management endpoints')
@ApiBearerAuth()
@UseGuards(JwtGuard, AccessTokenGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('options')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @ApiOperation({
    description: 'Use this endpoint to create an option',
    summary: 'Create options',
  })
  @Post()
  async create(@Body() createOptionDto: CreateOptionDto): Promise<Option> {
    const option = await this.optionService.create(createOptionDto);
    return option;
  }

  @ApiOperation({
    description: 'Use this endpoint to update an option',
    summary: 'Update an option',
  })
  @Patch(':id')
  async update(
    @Param() idParam: IdParamDto,
    @Body() updateOptionDto: UpdateOptionDto,
  ): Promise<Option> {
    const option = await this.optionService.update(idParam.id, updateOptionDto);
    return option;
  }
}
