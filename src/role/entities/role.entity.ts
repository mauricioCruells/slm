import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { StatusEnum } from '@Core/enums';
import { User } from '@User/entities';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  alias: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @OneToMany(() => User, (users) => users.role, { cascade: true })
  users: User[];
}
