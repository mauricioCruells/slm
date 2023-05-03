import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { StatusEnum } from '@Core/enums';

export class EvaluationRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(StatusEnum)
  @IsOptional()
  @Expose()
  status?: StatusEnum;
}
