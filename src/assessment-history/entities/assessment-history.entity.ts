import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@User/entities';
import { Assessment } from '@Assessment/entities';

@Entity()
export class AssessmentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'executed_by' })
  executedBy: User;

  @ManyToOne(
    () => Assessment,
    (assessment) => assessment.assessmentHistoryLogs,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  assessment: Assessment;
}
