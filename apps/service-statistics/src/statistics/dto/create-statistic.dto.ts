import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { TipoPeriodo } from '@app/shared';

export class CreateStatisticDto {
  @IsNotEmpty()
  @IsEnum(TipoPeriodo)
  periodo: TipoPeriodo;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: Date;

  @IsNotEmpty()
  @IsDateString()
  fechaFin: Date;
}

export class GenerateStatisticsDto {
  @IsNotEmpty()
  @IsEnum(TipoPeriodo)
  periodo: TipoPeriodo;

  @IsOptional()
  @IsDateString()
  fechaInicio?: Date;

  @IsOptional()
  @IsDateString()
  fechaFin?: Date;
}
