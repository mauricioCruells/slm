import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Skill } from '@Skill/entities';
import { SeniorityLevel } from '@Seniority-Level/entities';
import { StatusEnum } from '@Core/enums';
import { Question } from '@Question/entities';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  comments?: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Skill, (skill) => skill.topics)
  skill: Skill;

  @OneToMany(() => Question, (question) => question.topic)
  questions: Question[];
}
