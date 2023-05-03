import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OptionResponseDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  value: string;

  @ApiProperty()
  @Expose()
  isCorrect: boolean;
}
