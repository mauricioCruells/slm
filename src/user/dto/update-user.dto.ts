import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

import { StatusEnum } from '@Core/enums';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeID?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['Admin', 'Interviewee', 'Interviewer'])
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  evaluationRole?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seniorityLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(StatusEnum, {
    message: `status must be ${StatusEnum.ACTIVE} or ${StatusEnum.INACTIVE}`,
  })
  status?: StatusEnum;
}
