import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOptionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;
}
