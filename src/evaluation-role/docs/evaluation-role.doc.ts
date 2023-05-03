import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { StatusEnum } from '@Core/enums';

export class EvaluationRoleDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ enum: StatusEnum })
  @Expose()
  status: StatusEnum;
}
