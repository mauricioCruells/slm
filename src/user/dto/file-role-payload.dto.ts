import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RolePayload {
  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  role: string;
}
