import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { EstadoUsuario, RolUsuario } from '@app/shared';

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
}

export class CreateAdministradorDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  permisos?: string;
}

export class CreateVeterinarioDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  especialidad?: string;
}

export class CreateDuenoDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
