import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SeniorityLevelDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}
