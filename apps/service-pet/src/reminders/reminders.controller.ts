import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { ReminderProcessorService } from './reminder-processor.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Controller('reminders')
export class RemindersController {
  constructor(
    private readonly remindersService: RemindersService,
    private readonly reminderProcessorService: ReminderProcessorService,
  ) {}

  @Post()
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(createReminderDto);
  }

  @Get()
  findAll() {
    return this.remindersService.findAll();
  }

  @Get('pending')
  findPending() {
    return this.remindersService.findPending();
  }

  @Get('owner/:duenoId')
  findByOwner(@Param('duenoId') duenoId: string) {
    return this.remindersService.findByOwner(+duenoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remindersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) {
    return this.remindersService.update(+id, updateReminderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remindersService.remove(+id);
  }

  // Enviar recordatorio específico manualmente
  @Post(':id/send')
  sendReminder(@Param('id') id: string) {
    return this.reminderProcessorService.sendReminderManual(+id);
  }

  // Enviar recordatorio de vacunación inmediato
  @Post('send-vaccination')
  sendVaccinationReminder(
    @Body()
    body: {
      duenoId: number;
      mascotaId: number;
      nombreVacuna: string;
      fechaProgramada?: string;
      notas?: string;
    },
  ) {
    return this.reminderProcessorService.sendVaccinationReminderNow(body);
  }

  // Enviar recordatorio de cita inmediato
  @Post('send-appointment')
  sendAppointmentReminder(
    @Body()
    body: {
      duenoId: number;
      mascotaId: number;
      fechaCita: string;
      horaCita: string;
      motivo?: string;
      nombreVeterinario?: string;
    },
  ) {
    return this.reminderProcessorService.sendAppointmentReminderNow(body);
  }

  // Procesar todos los recordatorios pendientes manualmente
  @Post('process-all')
  processAllReminders() {
    return this.reminderProcessorService.processReminders();
  }
}
