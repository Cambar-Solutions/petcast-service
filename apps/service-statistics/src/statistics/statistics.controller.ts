import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';

/**
 * Controlador de Estadísticas
 * Maneja operaciones CRUD y resumen de dashboard
 */
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  /**
   * Crear una nueva estadística
   * POST /api/statistics
   */
  @Post()
  create(@Body() createStatisticDto: CreateStatisticDto) {
    return this.statisticsService.create(createStatisticDto);
  }

  /**
   * Obtener resumen para el dashboard
   * GET /api/statistics/dashboard
   * Retorna un resumen con las estadísticas más recientes
   */
  @Get('dashboard')
  async getDashboard() {
    return this.statisticsService.getDashboardSummary();
  }

  /**
   * Obtener todas las estadísticas
   * GET /api/statistics
   */
  @Get()
  findAll() {
    return this.statisticsService.findAll();
  }

  /**
   * Obtener una estadística por ID
   * GET /api/statistics/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statisticsService.findOne(+id);
  }

  /**
   * Actualizar una estadística
   * PATCH /api/statistics/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatisticDto: UpdateStatisticDto) {
    return this.statisticsService.update(+id, updateStatisticDto);
  }

  /**
   * Eliminar una estadística
   * DELETE /api/statistics/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statisticsService.remove(+id);
  }
}
