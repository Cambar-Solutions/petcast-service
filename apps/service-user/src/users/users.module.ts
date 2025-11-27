import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, Administrador, Veterinario, Dueno } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Administrador, Veterinario, Dueno])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
