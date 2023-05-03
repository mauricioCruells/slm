import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthorizedRoles, AuthUser, User } from '@Auth/decorators';
import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';
import { ApiArrayResponse } from '@Core/decorators';
import { MultipleResponse } from '@Core/dto';
import { csvFileFilter, serializeMultipleResponse } from '@Core/utils';
import { UserRole } from '@Role/enums';

import { MasterFileDetailsDoc } from '../docs';
import { MasterFileService } from '../services';
import { MasterFileParamsDto } from '../dtos';

@ApiTags('Master file management endpoints')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, JwtGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('master-file')
export class MasterFileController {
  constructor(private readonly masterFileService: MasterFileService) {}
  @ApiOperation({
    description:
      'Use this endpoint to upload a file of topics with their skills and competencies',
    summary: 'Upload a file of competencies, skills and topics',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiArrayResponse(MasterFileDetailsDoc)
  @UseInterceptors(FileInterceptor('file', { fileFilter: csvFileFilter }))
  @Post('upload-master-file')
  async uploadMasterFile(
    @UploadedFile() file: Express.Multer.File,
    @User() user: AuthUser,
    @Query() params: MasterFileParamsDto,
  ): Promise<MultipleResponse<MasterFileDetailsDoc[]>> {
    if (!file)
      throw new BadRequestException('File not detected in the request.');

    const details = await this.masterFileService.uploadMasterFile(
      file,
      user.sub,
      params,
    );
    return serializeMultipleResponse(MasterFileDetailsDoc, details);
  }
}
