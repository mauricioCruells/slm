import { KnowledgeArea } from '@Knowledge-Area/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => KnowledgeArea, (knowledgeArea) => knowledgeArea.category)
  knowledgeAreas: KnowledgeArea[];
}
