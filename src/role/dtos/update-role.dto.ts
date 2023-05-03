import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsString()
  @IsNotEmpty()
  alias?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
