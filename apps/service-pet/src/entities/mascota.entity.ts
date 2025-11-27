import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Sexo } from '@app/shared';
import { FichaMedica } from './ficha-medica.entity';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'int' })
  edad: number;

  @Column({ length: 50 })
  especie: string;

  @Column({ length: 50, nullable: true })
  raza: string;

  @Column({ length: 50, nullable: true })
  color: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  talla: number;

  @Column({
    type: 'enum',
    enum: Sexo,
  })
  sexo: Sexo;

  @Column({ length: 255, nullable: true, unique: true })
  codigoQR: string;

  @CreateDateColumn()
  fechaRegistro: Date;

  @Column({ name: 'dueno_id' })
  duenoId: number;

  @OneToMany(() => FichaMedica, (ficha) => ficha.mascota, { cascade: true })
  fichasMedicas: FichaMedica[];
}
