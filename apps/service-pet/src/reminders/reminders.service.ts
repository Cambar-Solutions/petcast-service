import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Recordatorio } from '../entities/recordatorio.entity';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Recordatorio)
    private readonly recordatorioRepository: Repository<Recordatorio>,
  ) {}

  async create(createReminderDto: CreateReminderDto): Promise<Recordatorio> {
    const recordatorio = this.recordatorioRepository.create(createReminderDto);
    return this.recordatorioRepository.save(recordatorio);
  }

  async findAll(): Promise<Recordatorio[]> {
    return this.recordatorioRepository.find();
  }

  async findOne(id: number): Promise<Recordatorio> {
    const recordatorio = await this.recordatorioRepository.findOne({
      where: { id },
    });
    if (!recordatorio) {
      throw new NotFoundException(`Recordatorio con ID ${id} no encontrado`);
    }
    return recordatorio;
  }

  async findByOwner(duenoId: number): Promise<Recordatorio[]> {
    return this.recordatorioRepository.find({
      where: { duenoId },
      order: { fechaEnvio: 'ASC' },
    });
  }

  async findPending(): Promise<Recordatorio[]> {
    return this.recordatorioRepository.find({
      where: {
        enviado: false,
        fechaEnvio: LessThanOrEqual(new Date()),
      },
    });
  }

  async update(id: number, updateReminderDto: UpdateReminderDto): Promise<Recordatorio> {
    const recordatorio = await this.findOne(id);
    Object.assign(recordatorio, updateReminderDto);
    return this.recordatorioRepository.save(recordatorio);
  }

  async markAsSent(id: number): Promise<Recordatorio> {
    const recordatorio = await this.findOne(id);
    recordatorio.enviado = true;
    return this.recordatorioRepository.save(recordatorio);
  }

  async remove(id: number): Promise<void> {
    const recordatorio = await this.findOne(id);
    await this.recordatorioRepository.remove(recordatorio);
  }
}
