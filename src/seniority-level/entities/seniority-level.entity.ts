import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@User/entities';
import { Topic } from '@Topic/entities';
import { Question } from '@Question/entities';

@Entity('seniority_levels')
export class SeniorityLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (users) => users.seniorityLevel, { cascade: true })
  users: User[];

  @OneToMany(() => Topic, (topic) => topic.skill)
  topics: Topic[];

  @OneToMany(() => Question, (level) => level.level)
  questions: Question[];
}
