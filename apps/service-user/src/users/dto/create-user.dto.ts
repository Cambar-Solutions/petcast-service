import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { EstadoUsuario, RolUsuario } from '@app/shared';

/**
 * DTO para crear usuario
 * Incluye campos opcionales de todos los tipos de usuario
 * para permitir creación desde un endpoint genérico
 */
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsEmail()
  correoElectronico: string;

  @IsNotEmpty()
  @MinLength(6)
  contrasena: string;

  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @IsOptional()
  @IsEnum(EstadoUsuario)
  estado?: EstadoUsuario;

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

export class CreateAdministradorDto extends CreateUserDto {}

export class CreateVeterinarioDto extends CreateUserDto {}

export class CreateDuenoDto extends CreateUserDto {}
