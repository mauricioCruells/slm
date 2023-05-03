import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  alias: string;

  @ApiProperty()
  @Expose()
  description: string;
}
