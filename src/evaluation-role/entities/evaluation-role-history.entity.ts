import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@User/entities';

@Entity('evaluation_roles_history')
export class EvaluationRoleHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  oldEvaluationRole: string;

  @Column()
  newEvaluationRole: string;

  @ManyToOne(() => User, (user) => user.evaluationRoleHistory)
  user: User;
}
