import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { FichaMedica } from '../entities/ficha-medica.entity';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(FichaMedica)
    private readonly fichaMedicaRepository: Repository<FichaMedica>,
  ) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto): Promise<FichaMedica> {
    const ficha = this.fichaMedicaRepository.create(createMedicalRecordDto);
    return this.fichaMedicaRepository.save(ficha);
  }

  async findAll(): Promise<FichaMedica[]> {
    return this.fichaMedicaRepository.find({
      relations: ['mascota'],
    });
  }

  async findOne(id: number): Promise<FichaMedica> {
    const ficha = await this.fichaMedicaRepository.findOne({
      where: { id },
      relations: ['mascota'],
    });
    if (!ficha) {
      throw new NotFoundException(`Ficha médica con ID ${id} no encontrada`);
    }
    return ficha;
  }

  async findByPet(mascotaId: number): Promise<FichaMedica[]> {
    return this.fichaMedicaRepository.find({
      where: { mascotaId },
      order: { fechaConsulta: 'DESC' },
    });
  }

  async update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<FichaMedica> {
    const ficha = await this.findOne(id);
    Object.assign(ficha, updateMedicalRecordDto);
    return this.fichaMedicaRepository.save(ficha);
  }

  async remove(id: number): Promise<void> {
    const ficha = await this.findOne(id);
    await this.fichaMedicaRepository.remove(ficha);
  }
}
