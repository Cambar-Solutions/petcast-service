import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { CreateStatisticDto, GenerateStatisticsDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { Estadistica } from '../entities/estadistica.entity';
import { TipoPeriodo } from '@app/shared';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Estadistica)
    private readonly estadisticaRepository: Repository<Estadistica>,
    private readonly dataSource: DataSource,
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
      const mascotasResult = await this.dataSource.query(
        'SELECT COUNT(*) as total FROM mascotas'
      );
      const totalMascotas = parseInt(mascotasResult[0]?.total || '0');

      const mascotasActivasResult = await this.dataSource.query(
        "SELECT COUNT(*) as total FROM mascotas WHERE estado = 'ACTIVO' OR estado IS NULL"
      );
      const mascotasActivas = parseInt(mascotasActivasResult[0]?.total || '0');

      const mascotasInactivasResult = await this.dataSource.query(
        "SELECT COUNT(*) as total FROM mascotas WHERE estado = 'INACTIVO'"
      );
      const mascotasInactivas = parseInt(mascotasInactivasResult[0]?.total || '0');

      const citasResult = await this.dataSource.query(
        'SELECT COUNT(*) as total FROM citas'
      );
      const totalCitas = parseInt(citasResult[0]?.total || '0');

      const citasHoyResult = await this.dataSource.query(
        'SELECT COUNT(*) as total FROM citas WHERE DATE(fechaHora) = CURDATE()'
      );
      const citasHoy = parseInt(citasHoyResult[0]?.total || '0');

      const citasMesResult = await this.dataSource.query(
        'SELECT COUNT(*) as total FROM citas WHERE MONTH(fechaHora) = MONTH(CURDATE()) AND YEAR(fechaHora) = YEAR(CURDATE())'
      );
      const citasMes = parseInt(citasMesResult[0]?.total || '0');

      const clientesResult = await this.dataSource.query(
        "SELECT COUNT(*) as total FROM users WHERE rol = 'DUENO'"
      );
      const totalClientes = parseInt(clientesResult[0]?.total || '0');

      const veterinariosResult = await this.dataSource.query(
        "SELECT COUNT(*) as total FROM users WHERE rol = 'VETERINARIO'"
      );
      const totalVeterinarios = parseInt(veterinariosResult[0]?.total || '0');

      return {
        totalMascotas,
        totalCitas,
        totalClientes,
        totalVeterinarios,
        citasHoy,
        citasMes,
        mascotasActivas,
        mascotasInactivas,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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
}
