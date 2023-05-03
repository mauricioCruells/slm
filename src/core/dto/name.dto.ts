import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class NameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;
}
