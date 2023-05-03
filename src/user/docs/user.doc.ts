import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { StatusEnum } from '@Core/enums';
import { DATE_OPTIONS } from '@Core/utils';
import { SeniorityLevelDoc } from '@Seniority-Level/docs';

class RolesDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class UserDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  employeeID: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value ? value.name : null))
  @Type(() => RolesDoc)
  role: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => (value ? value.name : null))
  @Type(() => RolesDoc)
  evaluationRole: string;

  @ApiProperty({ enum: StatusEnum })
  @Expose()
  status: StatusEnum;

  @ApiProperty()
  @Type(() => Date)
  @Transform(({ value }) =>
    value ? value.toLocaleDateString('en-US', DATE_OPTIONS) : null,
  )
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  @Type(() => SeniorityLevelDoc)
  seniorityLevel: SeniorityLevelDoc;
}
