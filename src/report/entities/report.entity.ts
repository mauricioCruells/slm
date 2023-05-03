import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { KnowledgeArea } from '@Knowledge-Area/entities';
import { User } from '@User/entities';
import { Category } from '@Category/entities';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn()
  reportId: number;

  @ManyToOne(() => User, (user) => user.reports)
  generatedBy: User;

  @ManyToMany(() => KnowledgeArea)
  @JoinTable()
  knowledgeAreas: KnowledgeArea[];

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  interviewees: User[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Category)
  category: Category;
}
