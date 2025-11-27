import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { TipoPeriodo } from '@app/shared';

@Entity('estadisticas')
export class Estadistica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TipoPeriodo,
  })
  periodo: TipoPeriodo;

  @Column({ type: 'int', default: 0 })
  numeroCitas: number;

  @Column({ type: 'int', default: 0 })
  numeroClientes: number;

  @Column({ type: 'int', default: 0 })
  numeroMascotas: number;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFin: Date;

  @CreateDateColumn()
  fechaGeneracion: Date;
}
