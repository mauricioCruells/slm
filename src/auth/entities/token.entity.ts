import { User } from '@User/entities';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { getTokenExpiration } from '../utils/auth.utils';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  accessToken!: string;

  @Column()
  refreshToken!: string;

  @Column()
  expiresOn!: Date;

  @BeforeInsert()
  setExpiration(): void {
    this.expiresOn = getTokenExpiration();
  }
}
