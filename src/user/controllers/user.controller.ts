import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  MultipleResponse,
  PaginationDto,
  SingleResponse,
  IdParamDto,
} from '@Core/dto';
import {
  ApiPaginatedResponse,
  ApiSingleResponse,
  ApiArrayResponse,
} from '@Core/decorators';
import {
  csvFileFilter,
  serializeMultipleResponse,
  serializeResponse,
} from '@Core/utils';
import { AuthorizedRoles, AuthUser, User } from '@Auth/decorators';
import { UserRole } from '@Role/enums';
import { AccessTokenGuard, JwtGuard, RoleGuard } from '@Auth/guards';

import { UserDoc, UserFileDetailsDoc } from '../docs';
import { UserService } from '../services';
import { UpdateUserDto, UserParamDto } from '../dto';

@ApiTags('User management endpoints')
@ApiBearerAuth()
@UseGuards(JwtGuard, AccessTokenGuard, RoleGuard)
@AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiPaginatedResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to retrieve users paginated',
    summary: 'Get users',
  })
  @Get()
  async findAllPaginated(
    @Query() pagination: PaginationDto,
  ): Promise<MultipleResponse<UserDoc[]>> {
    const [users, total] = await this.userService.findAll(pagination);
    return serializeMultipleResponse(UserDoc, users, pagination, total);
  }

  @ApiArrayResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to find users by a given string',
    summary: 'Get users by email',
  })
  @Get('/search')
  async findUsersByEmail(
    @Query() userParam: UserParamDto,
  ): Promise<MultipleResponse<UserDoc[]>> {
    const users = await this.userService.findByEmail(userParam);

    return serializeMultipleResponse(UserDoc, users);
  }

  @ApiSingleResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to find a user by a given ID',
    summary: 'Get user by ID',
  })
  @Get('/:id')
  @AuthorizedRoles(UserRole.ADMIN, UserRole.INTERVIEWER, UserRole.INTERVIEWEE)
  async findUserById(
    @Param() id: IdParamDto,
    @User() loggedUserInformation: AuthUser,
  ): Promise<MultipleResponse<UserDoc>> {
    const user = await this.userService.findOneById(
      id.id,
      loggedUserInformation,
    );

    return serializeResponse(UserDoc, user);
  }

  @ApiSingleResponse(UserDoc)
  @ApiOperation({
    description: 'Use this endpoint to disable users by providing an ID',
    summary: 'Disable users',
  })
  @Delete('/:id/disable')
  async disableUser(@Param() id: IdParamDto): Promise<SingleResponse<UserDoc>> {
    const disabledUser = await this.userService.disableUser(id);

    return serializeResponse(UserDoc, disabledUser);
  }

  @ApiOperation({
    description: 'Use this endpoint to upload a file of users',
    summary: 'Upload a file users',
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
  @ApiArrayResponse(UserFileDetailsDoc, 201)
  @UseInterceptors(FileInterceptor('file', { fileFilter: csvFileFilter }))
  @Post('upload-file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MultipleResponse<UserFileDetailsDoc[]>> {
    if (!file)
      throw new BadRequestException('File not detected in the request.');

    const details = await this.userService.uploadFileAndSave(file);
    return serializeMultipleResponse(UserFileDetailsDoc, details);
  }

  @ApiSingleResponse(UserDoc)
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({
    description: 'Use this endpoint to update a user by a given ID',
    summary: 'Update user by ID',
  })
  @Patch('/:id')
  async updateUser(
    @Param() id: IdParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SingleResponse<UserDoc>> {
    const updatedUser = await this.userService.updateUser(id.id, updateUserDto);
    return serializeResponse(UserDoc, updatedUser);
  }
}
