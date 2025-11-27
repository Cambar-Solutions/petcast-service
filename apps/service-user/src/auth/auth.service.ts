import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto, RecuperarContrasenaDto, CambiarContrasenaDto } from './dto/create-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EstadoUsuario } from '@app/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.correoElectronico);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.estado === EstadoUsuario.BLOQUEADO) {
      throw new UnauthorizedException('Usuario bloqueado');
    }

    if (user.estado === EstadoUsuario.INACTIVO) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await user.validatePassword(loginDto.contrasena);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.usersService.updateLastAccess(user.id);

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correoElectronico: user.correoElectronico,
        rol: user.rol,
      },
      ...tokens,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correoElectronico: user.correoElectronico,
        rol: user.rol,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Token de refresco inválido');
    }
  }

  async recuperarContrasena(dto: RecuperarContrasenaDto) {
    const user = await this.usersService.findByEmail(dto.correoElectronico);

    if (!user) {
      return { message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña' };
    }

    return { message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña' };
  }

  async cambiarContrasena(dto: CambiarContrasenaDto) {
    try {
      const payload = this.jwtService.verify(dto.token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new BadRequestException('Token inválido');
      }

      await this.usersService.update(user.id, { contrasena: dto.nuevaContrasena });

      return { message: 'Contraseña actualizada exitosamente' };
    } catch {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async validateUser(userId: number) {
    return this.usersService.findOne(userId);
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.correoElectronico,
      rol: user.rol,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: 3600, // 1 hour
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: 604800, // 7 days
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
