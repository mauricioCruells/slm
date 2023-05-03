import { FileStatusEnum } from '@Core/enums';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionsFileMessagesEnum } from '@Question/enums';
import { Expose } from 'class-transformer';

export class QuestionsFileDetailsDoc {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  question: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  score: number;

  @ApiProperty()
  @Expose()
  time: number;

  @ApiProperty()
  @Expose()
  seniorityLevel: string;

  @ApiProperty()
  @Expose()
  topicName: string;

  @ApiProperty()
  @Expose()
  topicUid: string;

  @ApiProperty()
  @Expose()
  option1: string;

  @ApiProperty()
  @Expose()
  option1IsCorrect: boolean;

  @ApiProperty()
  @Expose()
  option2: string;

  @ApiProperty()
  @Expose()
  option2IsCorrect: boolean;

  @ApiProperty()
  @Expose()
  option3: string;

  @ApiProperty()
  @Expose()
  option3IsCorrect: boolean;

  @ApiProperty()
  @Expose()
  option4: string;

  @ApiProperty()
  @Expose()
  option4IsCorrect: boolean;

  @ApiProperty()
  @Expose()
  result: FileStatusEnum;

  @ApiProperty()
  @Expose()
  details: QuestionsFileMessagesEnum[];
}
