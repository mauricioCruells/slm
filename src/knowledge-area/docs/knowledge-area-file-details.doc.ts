import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { FileStatusEnum } from '@Core/enums';

import { KnowledgeAreasFileMessagesEnum } from '../enums';

export class KnowledgeAreaFileDetailsDoc {
  @ApiProperty()
  @Expose()
  uid: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty({ default: 0 })
  @Expose()
  L1LowerScore: number;

  @ApiProperty()
  @Expose()
  L1UpperScore: number;

  @ApiProperty()
  @Expose()
  L2LowerScore: number;

  @ApiProperty()
  @Expose()
  L2UpperScore: number;

  @ApiProperty()
  @Expose()
  L3LowerScore: number;

  @ApiProperty()
  @Expose()
  L3UpperScore: number;

  @ApiProperty()
  @Expose()
  L4LowerScore: number;

  @ApiProperty()
  @Expose()
  L4UpperScore: number;

  @ApiProperty()
  @Expose()
  L5LowerScore: number;

  @ApiProperty()
  @Expose()
  L5UpperScore: number;

  @ApiProperty()
  @Expose()
  L6LowerScore: number;

  @ApiProperty()
  @Expose()
  L6UpperScore: number;

  @ApiProperty()
  @Expose()
  L7LowerScore: number;

  @ApiProperty({ default: 100 })
  @Expose()
  L7UpperScore: number;

  @ApiProperty()
  @Expose()
  result: FileStatusEnum;

  @ApiProperty()
  @Expose()
  details: KnowledgeAreasFileMessagesEnum[];
}
