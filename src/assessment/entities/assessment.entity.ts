import {
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KnowledgeArea } from '@Knowledge-Area/entities';
import { User } from '@User/entities';
import { AssessmentHistory } from '@AssessmentHistory/entities';

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.assessments)
  @JoinTable()
  users: User[];

  @ManyToOne(() => KnowledgeArea, (knowledgeArea) => knowledgeArea.assessments)
  knowledgeArea: KnowledgeArea;

  @OneToMany(
    () => AssessmentHistory,
    (assessmentHistory) => assessmentHistory.assessment,
  )
  assessmentHistoryLogs: AssessmentHistory[];
}
