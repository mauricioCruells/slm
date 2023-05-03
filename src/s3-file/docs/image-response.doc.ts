import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ImageResponseDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value.split('/').pop())
  name: string;

  @ApiProperty()
  @Expose()
  url: string;
}
