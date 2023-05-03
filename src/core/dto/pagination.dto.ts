import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  page?: number = 1;

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    minimum: 1,
    default: 20,
  })
  items?: number;
}
