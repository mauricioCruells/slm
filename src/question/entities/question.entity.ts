import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { QuestionTypeEnum } from '@Core/enums/';
import { Option } from '@Option/entities';
import { SeniorityLevel } from '@Seniority-Level/entities';
import { Topic } from '@Topic/entities';
import { User } from '@User/entities';
import { S3CommonFiles } from '@S3File/entities';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: QuestionTypeEnum,
    default: QuestionTypeEnum.MULTIPLE_CHOICE,
  })
  type: QuestionTypeEnum;

  @Column({ nullable: false })
  score: number;

  @Column()
  time: number;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @ManyToOne(() => SeniorityLevel, (seniorityLevel) => seniorityLevel.questions)
  @JoinColumn()
  level: SeniorityLevel;

  @ManyToOne(() => User, (user) => user.questions)
  author: User;

  @ManyToOne(() => Topic, (topic) => topic.questions)
  topic: Topic;

  @Column()
  isActive: boolean;

  @UpdateDateColumn()
  lastUpdated: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne(() => S3CommonFiles, {
    eager: true,
    nullable: true,
  })
  image?: S3CommonFiles;
}
