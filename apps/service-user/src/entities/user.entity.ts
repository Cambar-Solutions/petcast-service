import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  TableInheritance,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EstadoUsuario, RolUsuario } from '@app/shared';

@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'rol' } })
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true, length: 150 })
  correoElectronico: string;

  @Column()
  contrasena: string;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.ACTIVO,
  })
  estado: EstadoUsuario;

  @Column({
    type: 'enum',
    enum: RolUsuario,
  })
  rol: RolUsuario;

  @CreateDateColumn()
  fechaCreacion: Date;

  @Column({ type: 'datetime', nullable: true })
  ultimoAcceso: Date;

  @Column({ length: 6, nullable: true })
  codigoRecuperacion: string;

  @Column({ type: 'datetime', nullable: true })
  codigoRecuperacionExpira: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.contrasena && !this.contrasena.startsWith('$2b$')) {
      this.contrasena = await bcrypt.hash(this.contrasena, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.contrasena);
  }
}
