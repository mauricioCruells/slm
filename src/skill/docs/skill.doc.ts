import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { CompetencyDoc } from '@Competency/docs';
import { StatusEnum } from '@Core/enums';
import { DATE_OPTIONS } from '@Core/utils';
import { TopicDoc } from '@Topic/docs';

export class SkillDoc {
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
  description: string;

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
  @Transform(({ value }) => (value ? value.name : undefined))
  competency?: string;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => TopicDoc)
  @Transform(({ value: topics }) => (topics?.length ? topics : undefined))
  topics?: TopicDoc[];
}
