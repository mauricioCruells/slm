import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { UserRole } from '@Role/enums';

export class RoleDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  role: UserRole;
}
