import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoCita } from '@app/shared';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  fechaHora: Date;

  @IsNotEmpty()
  @IsString()
  motivo: string;

  @IsOptional()
  @IsEnum(EstadoCita)
  estado?: EstadoCita;

  @IsNotEmpty()
  @IsNumber()
  mascotaId: number;

  @IsOptional()
  @IsNumber()
  veterinarioId?: number;

  @IsNotEmpty()
  @IsNumber()
  duenoId: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
