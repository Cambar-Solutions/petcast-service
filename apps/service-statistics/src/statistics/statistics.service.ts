import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateStatisticDto, GenerateStatisticsDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Estadistica } from '../entities/estadistica.entity';
import { TipoPeriodo } from '@app/shared';

// URLs de los microservicios internos
const SERVICES = {
  USER: process.env.SERVICE_USER_URL || 'http://localhost:4201',
  PET: process.env.SERVICE_PET_URL || 'http://localhost:4202',
  APPOINTMENT: process.env.SERVICE_APPOINTMENT_URL || 'http://localhost:4203',
};

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Estadistica)
    private readonly estadisticaRepository: Repository<Estadistica>,
  ) {}

  async create(createStatisticDto: CreateStatisticDto): Promise<Estadistica> {
    const estadistica = this.estadisticaRepository.create(createStatisticDto);
    return this.estadisticaRepository.save(estadistica);
  }

  async findAll(): Promise<Estadistica[]> {
    return this.estadisticaRepository.find({
      order: { fechaGeneracion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Estadistica> {
    const estadistica = await this.estadisticaRepository.findOne({
      where: { id },
    });
    if (!estadistica) {
      throw new NotFoundException('Estadistica con ID ' + id + ' no encontrada');
    }
    return estadistica;
  }

  async findByPeriod(periodo: TipoPeriodo): Promise<Estadistica[]> {
    return this.estadisticaRepository.find({
      where: { periodo },
      order: { fechaGeneracion: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Estadistica[]> {
    return this.estadisticaRepository.find({
      where: {
        fechaInicio: Between(startDate, endDate),
      },
      order: { fechaGeneracion: 'DESC' },
    });
  }

  async update(id: number, updateStatisticDto: UpdateStatisticDto): Promise<Estadistica> {
    const estadistica = await this.findOne(id);
    Object.assign(estadistica, updateStatisticDto);
    return this.estadisticaRepository.save(estadistica);
  }

  async remove(id: number): Promise<void> {
    const estadistica = await this.findOne(id);
    await this.estadisticaRepository.remove(estadistica);
  }

  async generateStatistics(dto: GenerateStatisticsDto): Promise<Estadistica> {
    const { periodo, fechaInicio, fechaFin } = dto;

    const dates = this.calculateDateRange(periodo, fechaInicio, fechaFin);

    const estadistica = this.estadisticaRepository.create({
      periodo,
      fechaInicio: dates.start,
      fechaFin: dates.end,
      numeroCitas: 0,
      numeroClientes: 0,
      numeroMascotas: 0,
    });

    return this.estadisticaRepository.save(estadistica);
  }

  private calculateDateRange(
    periodo: TipoPeriodo,
    fechaInicio?: Date,
    fechaFin?: Date,
  ): { start: Date; end: Date } {
    if (fechaInicio && fechaFin) {
      return { start: new Date(fechaInicio), end: new Date(fechaFin) };
    }

    const now = new Date();
    let start: Date;
    const end: Date = now;

    switch (periodo) {
      case TipoPeriodo.DIA:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case TipoPeriodo.SEMANA:
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case TipoPeriodo.MES:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case TipoPeriodo.ANIO:
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { start, end };
  }

  async getLatestByPeriod(periodo: TipoPeriodo): Promise<Estadistica | null> {
    return this.estadisticaRepository.findOne({
      where: { periodo },
      order: { fechaGeneracion: 'DESC' },
    });
  }

  /**
   * Obtiene estadisticas en tiempo real consultando los otros microservicios
   */
  async getDashboardSummary(): Promise<{
    totalMascotas: number;
    totalCitas: number;
    totalClientes: number;
    totalVeterinarios: number;
    citasHoy: number;
    citasMes: number;
    mascotasActivas: number;
    mascotasInactivas: number;
  }> {
    try {
      // Consultar todos los servicios en paralelo
      const [mascotas, citas, usuarios] = await Promise.all([
        this.fetchFromService(SERVICES.PET + '/api/pets'),
        this.fetchFromService(SERVICES.APPOINTMENT + '/api/appointments'),
        this.fetchFromService(SERVICES.USER + '/api/users'),
      ]);

      // Calcular estadisticas
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      // Filtrar citas de hoy
      const citasHoy = Array.isArray(citas) ? citas.filter((c: any) => {
        const fechaCita = new Date(c.fechaHora);
        fechaCita.setHours(0, 0, 0, 0);
        return fechaCita.getTime() === hoy.getTime();
      }).length : 0;

      // Filtrar citas del mes
      const citasMes = Array.isArray(citas) ? citas.filter((c: any) => {
        const fechaCita = new Date(c.fechaHora);
        return fechaCita >= inicioMes;
      }).length : 0;

      // Contar usuarios por rol
      const clientes = Array.isArray(usuarios) ? usuarios.filter((u: any) => u.rol === 'DUENO').length : 0;
      const veterinarios = Array.isArray(usuarios) ? usuarios.filter((u: any) => u.rol === 'VETERINARIO').length : 0;

      // Contar mascotas por estado
      const mascotasActivas = Array.isArray(mascotas) ? mascotas.filter((m: any) => m.estado === 'ACTIVO' || !m.estado).length : 0;
      const mascotasInactivas = Array.isArray(mascotas) ? mascotas.filter((m: any) => m.estado === 'INACTIVO').length : 0;

      return {
        totalMascotas: Array.isArray(mascotas) ? mascotas.length : 0,
        totalCitas: Array.isArray(citas) ? citas.length : 0,
        totalClientes: clientes,
        totalVeterinarios: veterinarios,
        citasHoy,
        citasMes,
        mascotasActivas,
        mascotasInactivas,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Retornar valores por defecto en caso de error
      return {
        totalMascotas: 0,
        totalCitas: 0,
        totalClientes: 0,
        totalVeterinarios: 0,
        citasHoy: 0,
        citasMes: 0,
        mascotasActivas: 0,
        mascotasInactivas: 0,
      };
    }
  }

  /**
   * Helper para hacer fetch a los otros microservicios
   */
  private async fetchFromService(url: string): Promise<any[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn('Failed to fetch from ' + url + ': ' + response.status);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.warn('Error fetching from ' + url + ':', error);
      return [];
    }
  }
}
