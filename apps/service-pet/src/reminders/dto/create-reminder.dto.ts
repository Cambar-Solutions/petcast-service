import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TipoRecordatorio } from '@app/shared';

export class CreateReminderDto {
  @IsNotEmpty()
  @IsDateString()
  fechaEnvio: Date;

  @IsNotEmpty()
  @IsEnum(TipoRecordatorio)
  tipo: TipoRecordatorio;

  @IsOptional()
  @IsNumber()
  citaId?: number;

  @IsOptional()
  @IsNumber()
  mascotaId?: number;

  @IsNotEmpty()
  @IsNumber()
  duenoId: number;

  @IsOptional()
  @IsString()
  mensaje?: string;
}
