import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Mascota } from '../entities/mascota.entity';
import { EstadoMascota } from '@app/shared';
import { v4 as uuidv4 } from 'uuid';

// Constante: dias maximos sin visita antes de inactivar (2 meses = 60 dias)
const DIAS_MAX_SIN_VISITA = 60;

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
      estado: createPetDto.estado || EstadoMascota.ACTIVO,
      ultimaVisita: createPetDto.ultimaVisita ? new Date(createPetDto.ultimaVisita) : new Date(),
    });
    return this.mascotaRepository.save(mascota);
  }

  async findAll(): Promise<Mascota[]> {
    const mascotas = await this.mascotaRepository.find({
      relations: ['fichasMedicas'],
    });
    // Verificar y actualizar estado basado en ultima visita
    return Promise.all(mascotas.map(m => this.verificarYActualizarEstado(m)));
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({
      where: { id },
      relations: ['fichasMedicas'],
    });
    if (!mascota) {
      throw new NotFoundException('Mascota con ID ' + id + ' no encontrada');
    }
    // Verificar y actualizar estado basado en ultima visita
    return this.verificarYActualizarEstado(mascota);
  }

  async findByOwner(duenoId: number): Promise<Mascota[]> {
    const mascotas = await this.mascotaRepository.find({
      where: { duenoId },
      relations: ['fichasMedicas'],
    });
    return Promise.all(mascotas.map(m => this.verificarYActualizarEstado(m)));
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
      throw new NotFoundException('Mascota no encontrada con el codigo QR proporcionado');
    }
    // Verificar estado antes de devolver
    const mascotaActualizada = await this.verificarYActualizarEstado(mascota);

    // Si la mascota esta inactiva, denegar acceso al QR
    if (mascotaActualizada.estado === EstadoMascota.INACTIVO) {
      throw new ForbiddenException(
        'Esta mascota esta inactiva. Debe asistir al veterinario para reactivar su perfil.',
      );
    }

    return mascotaActualizada;
  }

  /**
   * Actualiza el estado de una mascota manualmente
   */
  async updateStatus(id: number, estado: EstadoMascota): Promise<Mascota> {
    const mascota = await this.findOne(id);
    mascota.estado = estado;

    // Si se reactiva manualmente, actualizar tambien la ultima visita
    if (estado === EstadoMascota.ACTIVO) {
      mascota.ultimaVisita = new Date();
    }

    return this.mascotaRepository.save(mascota);
  }

  /**
   * Registra una visita al veterinario y reactiva la mascota
   */
  async registrarVisita(id: number): Promise<Mascota> {
    const mascota = await this.findOne(id);
    mascota.ultimaVisita = new Date();
    mascota.estado = EstadoMascota.ACTIVO;
    return this.mascotaRepository.save(mascota);
  }

  /**
   * Verifica si la mascota debe estar activa basado en la ultima visita
   * y actualiza el estado si es necesario
   */
  private async verificarYActualizarEstado(mascota: Mascota): Promise<Mascota> {
    // Si la mascota ya fue marcada manualmente como inactiva, respetamos eso
    // Solo verificamos si esta activa y deberia estar inactiva por tiempo
    if (mascota.estado === EstadoMascota.ACTIVO && mascota.ultimaVisita) {
      const diasSinVisita = this.calcularDiasSinVisita(mascota.ultimaVisita);

      if (diasSinVisita > DIAS_MAX_SIN_VISITA) {
        mascota.estado = EstadoMascota.INACTIVO;
        await this.mascotaRepository.save(mascota);
      }
    }

    return mascota;
  }

  /**
   * Calcula los dias transcurridos desde la ultima visita
   */
  private calcularDiasSinVisita(ultimaVisita: Date): number {
    const ahora = new Date();
    const fechaVisita = new Date(ultimaVisita);
    const diferencia = ahora.getTime() - fechaVisita.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  private generateQRCode(): string {
    return 'PET-' + uuidv4();
  }
}
