import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { EstadoCita } from '@app/shared';

/**
 * Controlador de Citas
 * Maneja todas las operaciones CRUD y filtros para citas veterinarias
 */
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Crear una nueva cita
   * POST /api/appointments
   */
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  /**
   * Obtener todas las citas
   * GET /api/appointments
   */
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  /**
   * Obtener citas de hoy
   * GET /api/appointments/today
   */
  @Get('today')
  findToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.appointmentsService.findByDateRange(today, tomorrow);
  }

  /**
   * Obtener citas por estado
   * GET /api/appointments/status/:estado
   * Ejemplo: /api/appointments/status/PROGRAMADA
   */
  @Get('status/:estado')
  findByStatus(@Param('estado') estado: EstadoCita) {
    return this.appointmentsService.findByStatus(estado);
  }

  /**
   * Obtener citas de una mascota específica
   * GET /api/appointments/pet/:mascotaId
   */
  @Get('pet/:mascotaId')
  findByPet(@Param('mascotaId') mascotaId: string) {
    return this.appointmentsService.findByPet(+mascotaId);
  }

  /**
   * Obtener citas de un dueño específico
   * GET /api/appointments/owner/:duenoId
   */
  @Get('owner/:duenoId')
  findByOwner(@Param('duenoId') duenoId: string) {
    return this.appointmentsService.findByOwner(+duenoId);
  }

  /**
   * Obtener citas de un veterinario específico
   * GET /api/appointments/vet/:veterinarioId
   */
  @Get('vet/:veterinarioId')
  findByVeterinarian(@Param('veterinarioId') veterinarioId: string) {
    return this.appointmentsService.findByVeterinarian(+veterinarioId);
  }

  /**
   * Obtener una cita por ID
   * GET /api/appointments/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  /**
   * Actualizar una cita
   * PATCH /api/appointments/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  /**
   * Confirmar una cita
   * PATCH /api/appointments/:id/confirm
   */
  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.appointmentsService.confirm(+id);
  }

  /**
   * Completar una cita
   * PATCH /api/appointments/:id/complete
   */
  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.appointmentsService.complete(+id);
  }

  /**
   * Cancelar una cita
   * PATCH /api/appointments/:id/cancel
   */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(+id);
  }

  /**
   * Eliminar una cita
   * DELETE /api/appointments/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
