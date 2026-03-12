import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('calculations')
export class Calculation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('decimal', { precision: 20, scale: 10 })
  operand1!: number;

  @Column('varchar', { length: 10 })
  operator!: string;

  @Column('decimal', { precision: 20, scale: 10 })
  operand2!: number;

  @Column('decimal', { precision: 20, scale: 10 })
  result!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
