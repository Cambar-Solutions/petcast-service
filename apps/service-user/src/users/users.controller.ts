import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolUsuario } from '@app/shared';

/**
 * Controlador de Usuarios
 * Maneja todas las operaciones CRUD y filtros para usuarios
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear un nuevo usuario
   * POST /api/users
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Obtener todos los usuarios
   * GET /api/users
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Obtener usuarios por rol
   * GET /api/users/role/:rol
   * Ejemplo: /api/users/role/VETERINARIO
   */
  @Get('role/:rol')
  findByRole(@Param('rol') rol: RolUsuario) {
    return this.usersService.findByRole(rol);
  }

  /**
   * Obtener todos los veterinarios (shortcut)
   * GET /api/users/veterinarios
   */
  @Get('veterinarios')
  findVeterinarios() {
    return this.usersService.findByRole(RolUsuario.VETERINARIO);
  }

  /**
   * Obtener todos los dueños (shortcut)
   * GET /api/users/duenos
   */
  @Get('duenos')
  findDuenos() {
    return this.usersService.findByRole(RolUsuario.DUENO);
  }

  /**
   * Obtener un usuario por ID
   * GET /api/users/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  /**
   * Actualizar un usuario
   * PATCH /api/users/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * Eliminar un usuario
   * DELETE /api/users/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
