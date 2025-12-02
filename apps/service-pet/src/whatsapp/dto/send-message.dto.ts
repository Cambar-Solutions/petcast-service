import { IsNotEmpty, IsString, IsArray, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { TipoRecordatorio } from '@app/shared';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class SendBulkMessageDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  phones: string[];

  @IsNotEmpty()
  @IsString()
  message: string;
}

export class SendReminderDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEnum(TipoRecordatorio)
  tipo: TipoRecordatorio;

  @IsNotEmpty()
  @IsString()
  nombreMascota: string;

  @IsNotEmpty()
  @IsString()
  nombreDueno: string;

  @IsOptional()
  @IsString()
  fechaCita?: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  nombreVacuna?: string;

  @IsOptional()
  @IsString()
  proximaFecha?: string;
}

export class SendVaccinationReminderDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  nombreMascota: string;

  @IsNotEmpty()
  @IsString()
  nombreDueno: string;

  @IsNotEmpty()
  @IsString()
  nombreVacuna: string;

  @IsOptional()
  @IsString()
  fechaProgramada?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}

export class SendAppointmentReminderDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  nombreMascota: string;

  @IsNotEmpty()
  @IsString()
  nombreDueno: string;

  @IsNotEmpty()
  @IsString()
  fechaCita: string;

  @IsNotEmpty()
  @IsString()
  horaCita: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  nombreVeterinario?: string;
}

export interface MessageResult {
  phone: string;
  success: boolean;
}

export interface MessageError {
  phone: string;
  error: string;
}

export interface BulkMessageResponse {
  success: boolean;
  total: number;
  successCount: number;
  errorCount: number;
  results: MessageResult[];
  errors: MessageError[];
  error?: string;
}
