import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '@Role/entities';
import { StatusEnum } from '@Core/enums';
import { SeniorityLevel } from '@Seniority-Level/entities';
import {
  EvaluationRoleHistory,
  EvaluationRole,
} from '@Evaluation-Role/entities';
import { Token } from '@Auth/entities';
import { Competency } from '@Competency/entities';
import { Question } from '@Question/entities';
import { Assessment } from '@Assessment/entities/assessment.entity';
import { Report } from '@Report/entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeID: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'date' })
  joiningDate: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @ManyToOne(() => EvaluationRole, (evaluationRole) => evaluationRole.users, {
    nullable: true,
  })
  evaluationRole: EvaluationRole;

  @ManyToOne(() => SeniorityLevel, (seniorityLevel) => seniorityLevel.users, {
    nullable: true,
  })
  seniorityLevel: SeniorityLevel;

  @OneToMany(
    () => EvaluationRoleHistory,
    (evaluationRoleHistory) => evaluationRoleHistory.user,
    {
      cascade: true,
    },
  )
  evaluationRoleHistory: EvaluationRoleHistory[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Competency, (competency) => competency.user)
  competencies: Competency[];

  @OneToMany(() => Question, (question) => question.author)
  questions: Question[];

  @ManyToMany(() => Assessment, (assessment) => assessment.users)
  @JoinTable()
  assessments: Assessment[];

  @ManyToMany(() => Assessment, (assessment) => assessment.users, {
    nullable: true,
  })
  @JoinTable()
  completedAssessments: Assessment[];

  @OneToMany(() => Report, (report) => report.generatedBy, { nullable: true })
  reports: Report[];
}
