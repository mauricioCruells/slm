import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CompetencyFileProperties {
  @IsString()
  @IsNotEmpty()
  @Expose()
  competencyUID: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  weight: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  knowledgeAreaName: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  evaluationRoleNames: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  skillUids: string;
}
