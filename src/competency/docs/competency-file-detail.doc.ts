import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { FileStatusEnum } from '@Core/enums';

import { CompetenciesFileMessagesEnum } from '../enums';

export class CompetencyFileDetailsDoc {
  @ApiProperty()
  @Expose()
  uid: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  weight: number;

  @ApiProperty()
  @Expose()
  knowledgeArea: string;

  @ApiProperty()
  @Expose()
  roles: string[];

  @ApiProperty()
  @Expose()
  skills: string[];

  @ApiProperty()
  @Expose()
  result: FileStatusEnum;

  @ApiProperty()
  @Expose()
  details: CompetenciesFileMessagesEnum[];
}
