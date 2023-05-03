import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsOptional,
  IsArray,
  IsInt,
  ArrayUnique,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';

export class CompetencyDto {
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

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  weight: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  knowledgeAreaId?: number;

  @ApiProperty()
  @Expose()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  evaluationRolesIds: number[];

  @ApiPropertyOptional()
  @Expose()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @ArrayUnique()
  @ArrayMinSize(1)
  skillsIds?: number[];
}
