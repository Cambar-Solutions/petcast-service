import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { EstadoCita } from '@app/shared';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  fechaHora: Date;

  @Column({ type: 'text' })
  motivo: string;

  @Column({
    type: 'enum',
    enum: EstadoCita,
    default: EstadoCita.PROGRAMADA,
  })
  estado: EstadoCita;

  @CreateDateColumn()
  fechaCreacion: Date;

  @Column({ name: 'mascota_id' })
  mascotaId: number;

  @Column({ name: 'veterinario_id', nullable: true })
  veterinarioId: number;

  @Column({ name: 'dueno_id' })
  duenoId: number;

  @Column({ type: 'text', nullable: true })
  notas: string;
}
