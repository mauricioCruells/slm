import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { OptionResponseDoc } from '@Option/doc';
import { ImageResponseDoc } from '@S3File/docs';

import { Question } from '../entities';

export class QuestionResponseDoc {
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
  @Type(() => OptionResponseDoc)
  options: OptionResponseDoc;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const level = (obj as Question).level;
    return level.name;
  })
  level: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const topic = (obj as Question).topic;
    return topic.name;
  })
  topic: string;

  @ApiProperty()
  @Expose({ name: 'author' })
  @Transform(({ obj }) => {
    const author = (obj as Question).author;
    const { firstName, lastName } = author;
    return `${firstName} ${lastName}`;
  })
  author: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  @Type(() => ImageResponseDoc)
  image: ImageResponseDoc;
}
