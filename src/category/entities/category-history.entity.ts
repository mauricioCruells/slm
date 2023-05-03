import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@User/entities';

@Entity('categories_history')
export class CategoryHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  previousName: string;

  @Column()
  newName: string;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;
}
