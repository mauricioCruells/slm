import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiSingleResponse } from '@Core/decorators';
import { SingleResponse } from '@Core/dto';
import { serializeResponse } from '@Core/utils';

import { LoggedUser, Tokens } from '../docs';
import { RefreshTokenDto } from '../dtos';
import { AzureADGuard } from '../guards';
import { AuthService } from '../services';

@ApiTags('Authentication EndPoints')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    description: 'Use this endpoint to login to SLM via Azure AD',
    summary: 'Login to SLM',
  })
  @ApiBearerAuth()
  @ApiSingleResponse(LoggedUser)
  @UseGuards(AzureADGuard)
  @Get('signin')
  async signin(@Req() req) {
    const user = await this.authService.login(req.user);
    return serializeResponse(LoggedUser, user);
  }

  @ApiOperation({
    description: 'Use this endpoint if you want to refresh your access token',
    summary: 'Refresh access token',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiSingleResponse(Tokens)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SingleResponse<Tokens>> {
    const tokens = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return serializeResponse(Tokens, tokens);
  }

  @ApiOperation({
    description: 'Use this endpoint if you want to logout from SLM',
    summary: 'Logout from SLM',
  })
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Req() request): Promise<void> {
    return this.authService.logout(request);
  }
}
