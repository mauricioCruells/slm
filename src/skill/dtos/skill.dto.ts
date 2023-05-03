import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsOptional,
  IsArray,
  IsInt,
  ArrayUnique,
  ArrayMinSize,
} from 'class-validator';

export class SkillDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  competencyId?: number;

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  topicsIds?: number[];
}
