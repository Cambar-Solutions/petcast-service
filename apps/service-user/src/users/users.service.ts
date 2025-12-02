import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  CreateAdministradorDto,
  CreateVeterinarioDto,
  CreateDuenoDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, Administrador, Veterinario, Dueno } from '../entities';
import { RolUsuario } from '@app/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Administrador)
    private readonly adminRepository: Repository<Administrador>,
    @InjectRepository(Veterinario)
    private readonly vetRepository: Repository<Veterinario>,
    @InjectRepository(Dueno)
    private readonly duenoRepository: Repository<Dueno>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { correoElectronico: createUserDto.correoElectronico },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    let user: User;

    switch (createUserDto.rol) {
      case RolUsuario.ADMINISTRADOR:
        user = this.adminRepository.create(createUserDto as CreateAdministradorDto);
        return this.adminRepository.save(user as Administrador);

      case RolUsuario.VETERINARIO:
        user = this.vetRepository.create(createUserDto as CreateVeterinarioDto);
        return this.vetRepository.save(user as Veterinario);

      case RolUsuario.DUENO:
        user = this.duenoRepository.create(createUserDto as CreateDuenoDto);
        return this.duenoRepository.save(user as Dueno);

      default:
        throw new Error('Rol de usuario no válido');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { correoElectronico: email },
    });
  }

  async findByPhone(telefono: string): Promise<Dueno | null> {
    // Limpiar el número de teléfono (solo dígitos)
    const cleanPhone = telefono.replace(/\D/g, '');

    // Buscar en dueños (los únicos que tienen teléfono)
    return this.duenoRepository.findOne({
      where: { telefono: cleanPhone },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findByRole(rol: RolUsuario): Promise<User[]> {
    return this.userRepository.find({ where: { rol } });
  }

  async updateLastAccess(id: number): Promise<void> {
    await this.userRepository.update(id, { ultimoAcceso: new Date() });
  }
}
