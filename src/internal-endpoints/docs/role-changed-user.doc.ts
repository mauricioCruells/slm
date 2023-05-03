import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class RolesDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class RoleChangedUserDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  @Type(() => RolesDoc)
  role: RolesDoc;
}
