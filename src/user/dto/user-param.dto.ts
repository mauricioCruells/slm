import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserParamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  email: string;
}
