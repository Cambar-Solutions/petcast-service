import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mascota } from './mascota.entity';

@Entity('fichas_medicas')
export class FichaMedica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  diagnostico: string;

  @Column({ type: 'text', nullable: true })
  tratamiento: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fechaConsulta: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  @Column({ name: 'mascota_id' })
  mascotaId: number;

  @ManyToOne(() => Mascota, (mascota) => mascota.fichasMedicas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mascota_id' })
  mascota: Mascota;

  @Column({ name: 'veterinario_id', nullable: true })
  veterinarioId: number;
}
