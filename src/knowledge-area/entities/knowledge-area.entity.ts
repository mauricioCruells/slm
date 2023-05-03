import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Competency } from '@Competency/entities';
import { StatusEnum } from '@Core/enums';
import { Assessment } from '@Assessment/entities';
import { Category } from '@Category/entities';

@Entity('knowledge_areas')
export class KnowledgeArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L1LowerScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L1UpperScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L2LowerScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L2UpperScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L3LowerScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L3UpperScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L4LowerScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L4UpperScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L5LowerScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L5UpperScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L6LowerScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L6UpperScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 0,
  })
  L7LowerScore: number;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 10,
    default: 100,
  })
  L7UpperScore: number;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @OneToMany(() => Competency, (competency) => competency.knowledgeArea)
  competencies: Competency[];

  @OneToMany(() => Assessment, (assessment) => assessment.knowledgeArea)
  assessments: Assessment[];

  @ManyToOne(() => Category, (category) => category.knowledgeAreas)
  category: Category;
}
