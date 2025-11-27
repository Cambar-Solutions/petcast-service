import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
