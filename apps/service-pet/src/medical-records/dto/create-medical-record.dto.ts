import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsNotEmpty()
  @IsString()
  diagnostico: string;

  @IsOptional()
  @IsString()
  tratamiento?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsNotEmpty()
  @IsNumber()
  mascotaId: number;

  @IsOptional()
  @IsNumber()
  veterinarioId?: number;
}
