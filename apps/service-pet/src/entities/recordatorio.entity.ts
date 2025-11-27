import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { TipoRecordatorio } from '@app/shared';

@Entity('recordatorios')
export class Recordatorio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  fechaEnvio: Date;

  @Column({
    type: 'enum',
    enum: TipoRecordatorio,
  })
  tipo: TipoRecordatorio;

  @Column({ default: false })
  enviado: boolean;

  @Column({ name: 'cita_id', nullable: true })
  citaId: number;

  @Column({ name: 'mascota_id', nullable: true })
  mascotaId: number;

  @Column({ name: 'dueno_id' })
  duenoId: number;

  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @CreateDateColumn()
  fechaCreacion: Date;
}
