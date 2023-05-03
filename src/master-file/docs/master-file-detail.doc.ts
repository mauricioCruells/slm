import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { FileStatusEnum } from '@Core/enums';

import { MasterFileMessagesEnum } from '../enums';

export class MasterFileDetailsDoc {
  @ApiProperty()
  @Expose()
  competencyUID: string;

  @ApiProperty()
  @Expose()
  competencyName: string;

  @ApiProperty()
  @Expose()
  competencyDescription: string;

  @ApiProperty()
  @Expose()
  skillName: string;

  @ApiProperty()
  @Expose()
  skillUID: string;

  @ApiProperty()
  @Expose()
  skillDescription: string;

  @ApiProperty()
  @Expose()
  topicName: string;

  @ApiProperty()
  @Expose()
  topicUID: string;

  @ApiProperty()
  @Expose()
  topicDescription: string;

  @ApiProperty()
  @Expose()
  comment: string;

  @ApiProperty()
  @Expose()
  result: FileStatusEnum;

  @ApiProperty()
  @Expose()
  details: MasterFileMessagesEnum[];
}
