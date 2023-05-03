import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { StatusEnum } from '@Core/enums';
import { DATE_OPTIONS } from '@Core/utils';
import { EvaluationRoleDoc } from '@Evaluation-Role/docs';
import { KnowledgeAreaDoc } from '@Knowledge-Area/docs';
import { SkillDoc } from '@Skill/docs';
import { UserDoc } from '@User/docs';

export class CompetencyDoc {
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

  @ApiProperty()
  @Expose()
  weight: number;

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

  @ApiProperty()
  @Expose()
  @Type(() => EvaluationRoleDoc)
  evaluationRoles: EvaluationRoleDoc[];

  @ApiPropertyOptional()
  @Expose()
  @Type(() => SkillDoc)
  @Transform(({ value: skills }) => (skills?.length ? skills : undefined))
  skills?: SkillDoc[];

  @ApiPropertyOptional()
  @Expose()
  @Type(() => KnowledgeAreaDoc)
  @Transform(({ value }) => (value ? value.name : undefined))
  knowledgeArea?: string;

  @ApiProperty()
  @Expose()
  @Type(() => UserDoc)
  @Transform(({ value: user }) =>
    user ? `${user.firstName} ${user.lastName}` : undefined,
  )
  user: string;
}
