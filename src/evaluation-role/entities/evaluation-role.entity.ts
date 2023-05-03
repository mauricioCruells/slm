import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StatusEnum } from '@Core/enums';
import { User } from '@User/entities';

@Entity('evaluation_roles')
export class EvaluationRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @OneToMany(() => User, (users) => users.evaluationRole, { cascade: true })
  users: User[];
}
