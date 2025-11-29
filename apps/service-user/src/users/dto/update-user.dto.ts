import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import {
  CreateUserDto,
  CreateAdministradorDto,
  CreateVeterinarioDto,
  CreateDuenoDto,
} from './create-user.dto';

/**
 * DTO para actualizar usuario
 * Incluye campos opcionales de todos los tipos de usuario
 * para permitir actualizaciones desde un endpoint genérico
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Campos de Administrador
  @IsOptional()
  @IsString()
  permisos?: string;

  // Campos de Veterinario
  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  especialidad?: string;

  // Campos de Dueño
  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}

export class UpdateAdministradorDto extends PartialType(CreateAdministradorDto) {}

export class UpdateVeterinarioDto extends PartialType(CreateVeterinarioDto) {}

export class UpdateDuenoDto extends PartialType(CreateDuenoDto) {}
