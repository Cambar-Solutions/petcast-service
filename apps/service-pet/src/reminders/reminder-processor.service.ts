import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThanOrEqual } from 'typeorm';
import { Recordatorio } from '../entities/recordatorio.entity';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { TipoRecordatorio } from '@app/shared';

@Injectable()
export class ReminderProcessorService {
  private readonly logger = new Logger(ReminderProcessorService.name);

  constructor(
    @InjectRepository(Recordatorio)
    private readonly recordatorioRepository: Repository<Recordatorio>,
    private readonly whatsappService: WhatsappService,
    private readonly dataSource: DataSource,
  ) {}

  // Procesar recordatorios pendientes cada 5 minutos
  @Cron(CronExpression.EVERY_5_MINUTES)
  async processReminders() {
    this.logger.log('Iniciando procesamiento de recordatorios pendientes...');

    try {
      // Buscar recordatorios pendientes que ya deberían haberse enviado
      const pendingReminders = await this.recordatorioRepository.find({
        where: {
          enviado: false,
          fechaEnvio: LessThanOrEqual(new Date()),
        },
      });

      if (pendingReminders.length === 0) {
        this.logger.log('No hay recordatorios pendientes');
        return;
      }

      this.logger.log(
        `Encontrados ${pendingReminders.length} recordatorios pendientes`,
      );

      for (const reminder of pendingReminders) {
        await this.sendReminder(reminder);
      }
    } catch (error) {
      this.logger.error('Error procesando recordatorios', error);
    }
  }

  private async sendReminder(reminder: Recordatorio) {
    try {
      // Obtener información del dueño y mascota
      const ownerInfo = await this.getOwnerInfo(reminder.duenoId);
      const petInfo = reminder.mascotaId
        ? await this.getPetInfo(reminder.mascotaId)
        : null;

      if (!ownerInfo || !ownerInfo.telefono) {
        this.logger.warn(
          `No se encontró teléfono para el dueño ${reminder.duenoId}`,
        );
        return;
      }

      const detalles: any = {};

      // Parsear el mensaje para obtener detalles adicionales si existen
      if (reminder.mensaje) {
        try {
          const parsed = JSON.parse(reminder.mensaje);
          Object.assign(detalles, parsed);
        } catch {
          // Si no es JSON, usar como mensaje simple
          detalles.mensaje = reminder.mensaje;
        }
      }

      const result = await this.whatsappService.sendReminderByType(
        ownerInfo.telefono,
        reminder.tipo,
        ownerInfo.nombre,
        petInfo?.nombre || 'tu mascota',
        detalles,
      );

      if (result.success) {
        // Marcar como enviado
        reminder.enviado = true;
        await this.recordatorioRepository.save(reminder);
        this.logger.log(`Recordatorio ${reminder.id} enviado exitosamente`);
      } else {
        this.logger.error(
          `Error enviando recordatorio ${reminder.id}: ${result.error}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error procesando recordatorio ${reminder.id}`,
        error,
      );
    }
  }

  private async getOwnerInfo(
    duenoId: number,
  ): Promise<{ nombre: string; telefono: string } | null> {
    try {
      const result = await this.dataSource.query(
        `SELECT nombre, telefono FROM users WHERE id = ? AND rol = 'DUENO'`,
        [duenoId],
      );

      if (result && result.length > 0) {
        return {
          nombre: result[0].nombre,
          telefono: result[0].telefono,
        };
      }
      return null;
    } catch (error) {
      this.logger.error(`Error obteniendo información del dueño ${duenoId}`, error);
      return null;
    }
  }

  private async getPetInfo(
    mascotaId: number,
  ): Promise<{ nombre: string } | null> {
    try {
      const result = await this.dataSource.query(
        `SELECT nombre FROM mascotas WHERE id = ?`,
        [mascotaId],
      );

      if (result && result.length > 0) {
        return { nombre: result[0].nombre };
      }
      return null;
    } catch (error) {
      this.logger.error(`Error obteniendo información de mascota ${mascotaId}`, error);
      return null;
    }
  }

  // Método manual para enviar un recordatorio específico
  async sendReminderManual(reminderId: number) {
    const reminder = await this.recordatorioRepository.findOne({
      where: { id: reminderId },
    });

    if (!reminder) {
      return { success: false, error: 'Recordatorio no encontrado' };
    }

    await this.sendReminder(reminder);
    return { success: true, message: 'Recordatorio procesado' };
  }

  // Enviar recordatorio de vacunación inmediato
  async sendVaccinationReminderNow(data: {
    duenoId: number;
    mascotaId: number;
    nombreVacuna: string;
    fechaProgramada?: string;
    notas?: string;
  }) {
    const ownerInfo = await this.getOwnerInfo(data.duenoId);
    const petInfo = await this.getPetInfo(data.mascotaId);

    if (!ownerInfo || !ownerInfo.telefono) {
      return { success: false, error: 'No se encontró el teléfono del dueño' };
    }

    return this.whatsappService.sendVaccinationReminder({
      phone: ownerInfo.telefono,
      nombreDueno: ownerInfo.nombre,
      nombreMascota: petInfo?.nombre || 'tu mascota',
      nombreVacuna: data.nombreVacuna,
      fechaProgramada: data.fechaProgramada,
      notas: data.notas,
    });
  }

  // Enviar recordatorio de cita inmediato
  async sendAppointmentReminderNow(data: {
    duenoId: number;
    mascotaId: number;
    fechaCita: string;
    horaCita: string;
    motivo?: string;
    nombreVeterinario?: string;
  }) {
    const ownerInfo = await this.getOwnerInfo(data.duenoId);
    const petInfo = await this.getPetInfo(data.mascotaId);

    if (!ownerInfo || !ownerInfo.telefono) {
      return { success: false, error: 'No se encontró el teléfono del dueño' };
    }

    return this.whatsappService.sendAppointmentReminder({
      phone: ownerInfo.telefono,
      nombreDueno: ownerInfo.nombre,
      nombreMascota: petInfo?.nombre || 'tu mascota',
      fechaCita: data.fechaCita,
      horaCita: data.horaCita,
      motivo: data.motivo,
      nombreVeterinario: data.nombreVeterinario,
    });
  }
}
