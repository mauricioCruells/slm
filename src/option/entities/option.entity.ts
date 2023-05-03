import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Question } from '@Question/entities';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column({ nullable: true })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.options)
  question: Question;
}
