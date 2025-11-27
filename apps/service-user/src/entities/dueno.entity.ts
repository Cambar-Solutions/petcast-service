import { Column, ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { RolUsuario } from '@app/shared';

@ChildEntity(RolUsuario.DUENO)
export class Dueno extends User {
  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  constructor() {
    super();
    this.rol = RolUsuario.DUENO;
  }
}
