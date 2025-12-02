import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { Sexo, EstadoMascota } from '@app/shared';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  edad: number;

  @IsNotEmpty()
  @IsString()
  especie: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsNumber()
  talla?: number;

  @IsNotEmpty()
  @IsEnum(Sexo)
  sexo: Sexo;

  @IsOptional()
  @IsEnum(EstadoMascota)
  estado?: EstadoMascota;

  @IsOptional()
  @IsDateString()
  ultimaVisita?: string;

  @IsOptional()
  @IsNumber()
  duenoId?: number;

  // URL de la imagen de la mascota (opcional)
  @IsOptional()
  @IsString()
  imagen?: string;
}
