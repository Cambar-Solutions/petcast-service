import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Mascota } from '../entities/mascota.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Mascota> {
    const mascota = this.mascotaRepository.create({
      ...createPetDto,
      codigoQR: this.generateQRCode(),
    });
    return this.mascotaRepository.save(mascota);
  }

  async findAll(): Promise<Mascota[]> {
    return this.mascotaRepository.find({
      relations: ['fichasMedicas'],
    });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({
      where: { id },
      relations: ['fichasMedicas'],
    });
    if (!mascota) {
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    return mascota;
  }

  async findByOwner(duenoId: number): Promise<Mascota[]> {
    return this.mascotaRepository.find({
      where: { duenoId },
      relations: ['fichasMedicas'],
    });
  }

  async update(id: number, updatePetDto: UpdatePetDto): Promise<Mascota> {
    const mascota = await this.findOne(id);
    Object.assign(mascota, updatePetDto);
    return this.mascotaRepository.save(mascota);
  }

  async remove(id: number): Promise<void> {
    const mascota = await this.findOne(id);
    await this.mascotaRepository.remove(mascota);
  }

  async findByQRCode(codigoQR: string): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({
      where: { codigoQR },
      relations: ['fichasMedicas'],
    });
    if (!mascota) {
      throw new NotFoundException('Mascota no encontrada con el código QR proporcionado');
    }
    return mascota;
  }

  private generateQRCode(): string {
    return `PET-${uuidv4()}`;
  }
}
