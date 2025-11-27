import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Cita } from '../entities/cita.entity';
import { EstadoCita } from '@app/shared';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Cita> {
    const cita = this.citaRepository.create(createAppointmentDto);
    return this.citaRepository.save(cita);
  }

  async findAll(): Promise<Cita[]> {
    return this.citaRepository.find({
      order: { fechaHora: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citaRepository.findOne({ where: { id } });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }
    return cita;
  }

  async findByPet(mascotaId: number): Promise<Cita[]> {
    return this.citaRepository.find({
      where: { mascotaId },
      order: { fechaHora: 'DESC' },
    });
  }

  async findByOwner(duenoId: number): Promise<Cita[]> {
    return this.citaRepository.find({
      where: { duenoId },
      order: { fechaHora: 'ASC' },
    });
  }

  async findByVeterinarian(veterinarioId: number): Promise<Cita[]> {
    return this.citaRepository.find({
      where: { veterinarioId },
      order: { fechaHora: 'ASC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Cita[]> {
    return this.citaRepository.find({
      where: {
        fechaHora: Between(startDate, endDate),
      },
      order: { fechaHora: 'ASC' },
    });
  }

  async findByStatus(estado: EstadoCita): Promise<Cita[]> {
    return this.citaRepository.find({
      where: { estado },
      order: { fechaHora: 'ASC' },
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Cita> {
    const cita = await this.findOne(id);
    Object.assign(cita, updateAppointmentDto);
    return this.citaRepository.save(cita);
  }

  async updateStatus(id: number, estado: EstadoCita): Promise<Cita> {
    const cita = await this.findOne(id);
    cita.estado = estado;
    return this.citaRepository.save(cita);
  }

  async cancel(id: number): Promise<Cita> {
    return this.updateStatus(id, EstadoCita.CANCELADA);
  }

  async complete(id: number): Promise<Cita> {
    return this.updateStatus(id, EstadoCita.COMPLETADA);
  }

  async confirm(id: number): Promise<Cita> {
    return this.updateStatus(id, EstadoCita.CONFIRMADA);
  }

  async remove(id: number): Promise<void> {
    const cita = await this.findOne(id);
    await this.citaRepository.remove(cita);
  }

  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.citaRepository.count({
      where: {
        fechaHora: Between(startDate, endDate),
      },
    });
  }
}
