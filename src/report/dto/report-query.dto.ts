import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

import { SortOptions } from '../enums';
import {
  parseCommaSeparatedParams,
  parseCommaSeparatedNumbers,
  parseSortOptions,
} from '../utils';
import { ReportApiParams } from '../constants';

export class ReportQueryDto {
  @ApiPropertyOptional({
    example: ReportApiParams.knowledgeAreaIdsExample,
    description: ReportApiParams.knowledgeAreaIdsDescription,
    type: 'string',
  })
  @Expose()
  @IsNumber({ allowNaN: false }, { each: true })
  @Transform(({ value }) => (value ? parseCommaSeparatedNumbers(value) : []))
  knowledgeAreaIds: number[];

  @ApiPropertyOptional({
    example: ReportApiParams.evaluationRoleIdsExample,
    description: ReportApiParams.evaluationRoleIdsDescription,
    type: 'string',
  })
  @Expose()
  @IsNumber({ allowNaN: false }, { each: true })
  @Transform(({ value }) => (value ? parseCommaSeparatedNumbers(value) : []))
  evaluationRoleIds: number[];

  @ApiPropertyOptional({
    example: '2,3,4',
    description: 'to find information for specific users by their ids',
    type: 'string',
  })
  @Expose()
  @Expose()
  @IsNumber({ allowNaN: false }, { each: true })
  @Transform(({ value }) => (value ? parseCommaSeparatedNumbers(value) : []))
  userIds: number[];

  @ApiPropertyOptional({
    example: ReportApiParams.namesExample,
    description: ReportApiParams.namesDescription,
    type: 'string',
  })
  @Expose()
  @IsArray()
  @Transform(({ value }) => (value ? parseCommaSeparatedParams(value) : []))
  names: string[];

  @ApiPropertyOptional({
    example: ReportApiParams.emailsExample,
    description: ReportApiParams.emailsDescription,
    type: 'string',
  })
  @Expose()
  @IsArray()
  @Transform(({ value }) => (value ? parseCommaSeparatedParams(value) : []))
  emails: string[];

  @ApiPropertyOptional({
    example: ReportApiParams.seniorityLevelsExample,
    description: ReportApiParams.seniorityLevelsDescription,
    type: 'string',
  })
  @Expose()
  @IsNumber({ allowNaN: false }, { each: true })
  @Transform(({ value }) => (value ? parseCommaSeparatedNumbers(value) : []))
  seniorityLevelIds: number[];

  @ApiPropertyOptional({
    example: ReportApiParams.sortExample,
    description: ReportApiParams.sortDescription,
    type: 'string',
  })
  @Expose()
  @IsArray()
  @Transform(({ value }) => (value ? parseSortOptions(value) : []))
  sort: SortOptions[];
}
