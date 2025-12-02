import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RecuperarContrasenaDto,
  CambiarContrasenaDto,
  SolicitarCodigoWhatsAppDto,
  VerificarCodigoWhatsAppDto,
  ResetContrasenaWhatsAppDto,
} from './dto/create-auth.dto';
import { RefreshTokenDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public, CurrentUser } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('recuperar-contrasena')
  @HttpCode(HttpStatus.OK)
  recuperarContrasena(@Body() dto: RecuperarContrasenaDto) {
    return this.authService.recuperarContrasena(dto);
  }

  @Public()
  @Post('cambiar-contrasena')
  @HttpCode(HttpStatus.OK)
  cambiarContrasena(@Body() dto: CambiarContrasenaDto) {
    return this.authService.cambiarContrasena(dto);
  }

  @Public()
  @Post('solicitar-codigo-whatsapp')
  @HttpCode(HttpStatus.OK)
  solicitarCodigoWhatsApp(@Body() dto: SolicitarCodigoWhatsAppDto) {
    return this.authService.solicitarCodigoWhatsApp(dto);
  }

  @Public()
  @Post('verificar-codigo-whatsapp')
  @HttpCode(HttpStatus.OK)
  verificarCodigoWhatsApp(@Body() dto: VerificarCodigoWhatsAppDto) {
    return this.authService.verificarCodigoWhatsApp(dto);
  }

  @Public()
  @Post('reset-contrasena-whatsapp')
  @HttpCode(HttpStatus.OK)
  resetContrasenaWhatsApp(@Body() dto: ResetContrasenaWhatsAppDto) {
    return this.authService.resetContrasenaWhatsApp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.authService.validateUser(user.id);
  }
}
