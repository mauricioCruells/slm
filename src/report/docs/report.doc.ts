import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { DATE_OPTIONS } from '@Core/utils';
import { KnowledgeAreaDoc } from '@Knowledge-Area/docs';
import { UserDoc } from '@User/docs';

import { IntervieweesDoc } from './interviewees.doc';

export class ReportDoc {
  @ApiProperty()
  @Expose()
  reportId: number;

  @ApiProperty()
  @Expose()
  generatedBy: UserDoc;

  @ApiProperty()
  @Expose()
  knowledgeAreas: KnowledgeAreaDoc[];

  @ApiProperty()
  @Expose()
  interviewees: IntervieweesDoc;

  @ApiProperty()
  @Type(() => Date)
  @Transform(({ value }) =>
    value ? value.toLocaleDateString('en-US', DATE_OPTIONS) : null,
  )
  @Expose()
  createdAt: string;
}
