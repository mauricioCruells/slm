import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Competency } from '@Competency/entities';
import { Topic } from '@Topic/entities';
import { StatusEnum } from '@Core/enums';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Competency, (competency) => competency.skills)
  competency: Competency;

  @OneToMany(() => Topic, (topic) => topic.skill)
  topics: Topic[];
}
