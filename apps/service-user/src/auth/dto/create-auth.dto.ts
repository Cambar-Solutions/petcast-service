import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  correoElectronico: string;

  @IsNotEmpty()
  @IsString()
  contrasena: string;
}

export class RecuperarContrasenaDto {
  @IsNotEmpty()
  @IsEmail()
  correoElectronico: string;
}

export class CambiarContrasenaDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  nuevaContrasena: string;
}

// DTOs para recuperación por WhatsApp
export class SolicitarCodigoWhatsAppDto {
  @IsNotEmpty()
  @IsString()
  telefono: string;
}

export class VerificarCodigoWhatsAppDto {
  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsString()
  codigo: string;
}

export class ResetContrasenaWhatsAppDto {
  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @MinLength(6)
  nuevaContrasena: string;
}
