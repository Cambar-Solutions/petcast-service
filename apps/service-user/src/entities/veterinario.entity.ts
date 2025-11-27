import { Column, ChildEntity } from 'typeorm';
import { User } from './user.entity';
import { RolUsuario } from '@app/shared';

@ChildEntity(RolUsuario.VETERINARIO)
export class Veterinario extends User {
  @Column({ length: 50, nullable: true })
  cedula: string;

  @Column({ length: 100, nullable: true })
  especialidad: string;

  constructor() {
    super();
    this.rol = RolUsuario.VETERINARIO;
  }
}
