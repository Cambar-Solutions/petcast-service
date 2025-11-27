import { PartialType } from '@nestjs/mapped-types';
import {
  CreateUserDto,
  CreateAdministradorDto,
  CreateVeterinarioDto,
  CreateDuenoDto,
} from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateAdministradorDto extends PartialType(CreateAdministradorDto) {}

export class UpdateVeterinarioDto extends PartialType(CreateVeterinarioDto) {}

export class UpdateDuenoDto extends PartialType(CreateDuenoDto) {}
