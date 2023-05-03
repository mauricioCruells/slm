import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { Tokens } from './tokens.doc';

export class LoggedUser {
  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  role: string;

  @Expose()
  @ApiProperty()
  tokens: Tokens;
}
