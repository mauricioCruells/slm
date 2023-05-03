import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { StatusEnum } from '@Core/enums';
import { DATE_OPTIONS } from '@Core/utils';
import { CompetencyDoc } from '@Competency/docs';

export class KnowledgeAreaDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  uid: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value ? value : undefined))
  description?: string;

  @ApiProperty({ default: 0 })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L1LowerScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L1UpperScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L2LowerScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L2UpperScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L3LowerScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L3UpperScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L4LowerScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L4UpperScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L5LowerScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L5UpperScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L6LowerScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L6UpperScore: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L7LowerScore: number;

  @ApiProperty({ default: 100 })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  L7UpperScore: number;

  @ApiProperty({ enum: StatusEnum })
  @Expose()
  status: StatusEnum;

  @ApiProperty()
  @Type(() => Date)
  @Transform(({ value }) =>
    value ? value.toLocaleDateString('en-US', DATE_OPTIONS) : null,
  )
  @Expose()
  updatedAt: string;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => CompetencyDoc)
  @Transform(({ value }) => (value?.length ? value : undefined))
  competencies?: CompetencyDoc[];
}
