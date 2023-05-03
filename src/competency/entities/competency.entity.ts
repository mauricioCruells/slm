import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { KnowledgeArea } from '@Knowledge-Area/entities';
import { EvaluationRole } from '@Evaluation-Role/entities';
import { Skill } from '@Skill/entities';
import { StatusEnum } from '@Core/enums';
import { User } from '@User/entities';

@Entity('competencies')
export class Competency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal' })
  weight: number;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => KnowledgeArea, (knowledgeArea) => knowledgeArea.competencies)
  knowledgeArea: KnowledgeArea;

  @ManyToMany(() => EvaluationRole)
  @JoinTable()
  evaluationRoles: EvaluationRole[];

  @OneToMany(() => Skill, (skill) => skill.competency)
  skills: Skill[];

  @ManyToOne(() => User, (user) => user.competencies)
  user: User;
}
