import { Entity, Column, ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { RolUsuario } from '@app/shared';

@ChildEntity(RolUsuario.ADMINISTRADOR)
export class Administrador extends User {
  @Column({ type: 'text', nullable: true })
  permisos: string;

  constructor() {
    super();
    this.rol = RolUsuario.ADMINISTRADOR;
  }
}
