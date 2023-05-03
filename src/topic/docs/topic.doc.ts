import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { StatusEnum } from '@Core/enums';
import { DATE_OPTIONS } from '@Core/utils';
import { SkillDoc } from '@Skill/docs';
import { QuestionResponseDoc } from '@Question/doc';

export class TopicDoc {
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

  @ApiPropertyOptional()
  @Expose()
  @Transform(({ value }) => (value ? value : undefined))
  comments?: string;

  @ApiProperty()
  @Type(() => Date)
  @Transform(({ value }) =>
    value ? value.toLocaleDateString('en-US', DATE_OPTIONS) : null,
  )
  @Expose()
  updatedAt: string;

  @ApiProperty({ enum: StatusEnum })
  @Expose()
  status: StatusEnum;

  @ApiPropertyOptional()
  @Expose()
  @Type(() => SkillDoc)
  @Transform(({ value }) => (value ? value.name : undefined))
  skill?: string;

  @ApiProperty()
  @Expose()
  questions: QuestionResponseDoc[];
}
