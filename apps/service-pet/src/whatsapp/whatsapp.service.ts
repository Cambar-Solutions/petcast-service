import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal';

// Desactivar verificación SSL solo para desarrollo (problema de certificados)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import {
  MessageResult,
  MessageError,
  BulkMessageResponse,
  SendAppointmentReminderDto,
  SendVaccinationReminderDto,
} from './dto/send-message.dto';
import { whatsappTemplates } from './whatsapp.templates';
import { TipoRecordatorio } from '@app/shared';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name);
  private sock: any;
  private qrCode: string | null = null;
  private connectionStatus:
    | 'disconnected'
    | 'connecting'
    | 'connected'
    | 'qr_required' = 'disconnected';

  async onModuleInit() {
    this.logger.log('Inicializando servicio de WhatsApp');
    await this.initializeConnection();
  }

  getConnectionInfo() {
    return {
      status: this.connectionStatus,
      qrRequired: this.connectionStatus === 'qr_required',
      qrCode: this.qrCode,
    };
  }

  getConnectionStatus() {
    return {
      status: this.connectionStatus,
      qrRequired: this.connectionStatus === 'qr_required',
    };
  }

  getQRCode(): string | null {
    return this.qrCode;
  }

  private async initializeConnection() {
    try {
      const { state, saveCreds } =
        await useMultiFileAuthState('auth_info_baileys');

      this.connectionStatus = 'connecting';
      this.logger.log('Iniciando conexión con WhatsApp');

      this.sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
      });

      this.sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrCode = qr;
          this.connectionStatus = 'qr_required';
          qrcode.generate(qr, { small: true });
          this.logger.log('Se requiere escanear código QR');
        }

        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;
          if (shouldReconnect) {
            this.connectionStatus = 'disconnected';
            this.qrCode = null;
            this.logger.log(
              'Conexión cerrada, intentando reconectar en 3 segundos',
            );
            setTimeout(() => this.initializeConnection(), 3000);
          }
        } else if (connection === 'open') {
          this.connectionStatus = 'connected';
          this.qrCode = null;
          this.logger.log('Conexión establecida con WhatsApp');
        }
      });

      this.sock.ev.on('creds.update', saveCreds);
    } catch (error) {
      this.logger.error('Error al inicializar conexión WhatsApp', error);
      throw error;
    }
  }

  async sendMessage(phone: string, message: string) {
    try {
      if (this.connectionStatus !== 'connected') {
        this.logger.warn(
          `Intento de envío fallido - WhatsApp no está conectado. Estado: ${this.connectionStatus}`,
        );
        return {
          success: false,
          error: 'WhatsApp no está conectado',
        };
      }

      const formattedPhone = this.formatPhoneNumber(phone);

      this.logger.log(`Enviando mensaje a ${formattedPhone}`);
      await this.sock.sendMessage(formattedPhone, { text: message });

      this.logger.log(`Mensaje enviado exitosamente a ${formattedPhone}`);
      return { success: true, message: 'Mensaje enviado correctamente' };
    } catch (error) {
      this.logger.error('Error al enviar mensaje', error);
      return { success: false, error: error.message };
    }
  }

  async sendBulkMessage(
    phones: string[],
    message: string,
  ): Promise<BulkMessageResponse> {
    try {
      if (this.connectionStatus !== 'connected') {
        this.logger.warn(
          `Intento de envío masivo fallido - WhatsApp no está conectado`,
        );
        return {
          success: false,
          total: 0,
          successCount: 0,
          errorCount: 0,
          results: [],
          errors: [],
          error: 'WhatsApp no está conectado',
        };
      }

      this.logger.log(`Iniciando envío masivo a ${phones.length} números`);

      const results: MessageResult[] = [];
      const errors: MessageError[] = [];

      for (const phone of phones) {
        try {
          const formattedPhone = this.formatPhoneNumber(phone);
          this.logger.log(`Enviando mensaje a ${formattedPhone}`);
          await this.sock.sendMessage(formattedPhone, { text: message });
          results.push({ phone, success: true });
          // Pequeña pausa para evitar bloqueos
          await this.delay(1000);
        } catch (error) {
          this.logger.error(`Error enviando a ${phone}`, error);
          errors.push({ phone, error: error.message });
        }
      }

      const successCount = results.length;
      const errorCount = errors.length;

      this.logger.log(
        `Envío masivo completado: ${successCount} exitosos, ${errorCount} fallidos`,
      );

      return {
        success: true,
        total: phones.length,
        successCount,
        errorCount,
        results,
        errors,
      };
    } catch (error) {
      this.logger.error('Error en envío masivo', error);
      return {
        success: false,
        total: 0,
        successCount: 0,
        errorCount: 0,
        results: [],
        errors: [],
        error: error.message,
      };
    }
  }

  // Enviar recordatorio de cita
  async sendAppointmentReminder(dto: SendAppointmentReminderDto) {
    const message = whatsappTemplates.appointmentReminder(
      dto.nombreDueno,
      dto.nombreMascota,
      dto.fechaCita,
      dto.horaCita,
      dto.motivo,
      dto.nombreVeterinario,
    );

    return this.sendMessage(dto.phone, message);
  }

  // Enviar recordatorio de vacunación
  async sendVaccinationReminder(dto: SendVaccinationReminderDto) {
    const message = whatsappTemplates.vaccinationReminder(
      dto.nombreDueno,
      dto.nombreMascota,
      dto.nombreVacuna,
      dto.fechaProgramada,
      dto.notas,
    );

    return this.sendMessage(dto.phone, message);
  }

  // Enviar recordatorio de revisión
  async sendCheckupReminder(
    phone: string,
    nombreDueno: string,
    nombreMascota: string,
    tipoRevision?: string,
  ) {
    const message = whatsappTemplates.checkupReminder(
      nombreDueno,
      nombreMascota,
      tipoRevision,
    );

    return this.sendMessage(phone, message);
  }

  // Enviar confirmación de cita
  async sendAppointmentConfirmation(
    phone: string,
    nombreDueno: string,
    nombreMascota: string,
    fechaCita: string,
    horaCita: string,
  ) {
    const message = whatsappTemplates.appointmentConfirmation(
      nombreDueno,
      nombreMascota,
      fechaCita,
      horaCita,
    );

    return this.sendMessage(phone, message);
  }

  // Enviar notificación de cancelación
  async sendAppointmentCancellation(
    phone: string,
    nombreDueno: string,
    nombreMascota: string,
    fechaCita: string,
  ) {
    const message = whatsappTemplates.appointmentCancellation(
      nombreDueno,
      nombreMascota,
      fechaCita,
    );

    return this.sendMessage(phone, message);
  }

  // Enviar seguimiento post-consulta
  async sendFollowUp(
    phone: string,
    nombreDueno: string,
    nombreMascota: string,
    indicaciones?: string,
  ) {
    const message = whatsappTemplates.followUp(
      nombreDueno,
      nombreMascota,
      indicaciones,
    );

    return this.sendMessage(phone, message);
  }

  // Enviar código de recuperación de contraseña
  async sendPasswordRecoveryCode(
    phone: string,
    nombreUsuario: string,
    codigo: string,
  ) {
    const message = whatsappTemplates.passwordRecoveryCode(
      nombreUsuario,
      codigo,
    );

    return this.sendMessage(phone, message);
  }

  // Enviar recordatorio según tipo
  async sendReminderByType(
    phone: string,
    tipo: TipoRecordatorio,
    nombreDueno: string,
    nombreMascota: string,
    detalles: {
      fechaCita?: string;
      horaCita?: string;
      motivo?: string;
      nombreVacuna?: string;
      proximaFecha?: string;
      tipoRevision?: string;
    },
  ) {
    switch (tipo) {
      case TipoRecordatorio.CITA_PROXIMA:
        return this.sendAppointmentReminder({
          phone,
          nombreDueno,
          nombreMascota,
          fechaCita: detalles.fechaCita || 'Por confirmar',
          horaCita: detalles.horaCita || 'Por confirmar',
          motivo: detalles.motivo,
        });

      case TipoRecordatorio.VACUNACION:
        return this.sendVaccinationReminder({
          phone,
          nombreDueno,
          nombreMascota,
          nombreVacuna: detalles.nombreVacuna || 'Vacuna pendiente',
          fechaProgramada: detalles.proximaFecha,
        });

      case TipoRecordatorio.REVISION:
        return this.sendCheckupReminder(
          phone,
          nombreDueno,
          nombreMascota,
          detalles.tipoRevision,
        );

      default:
        return { success: false, error: 'Tipo de recordatorio no válido' };
    }
  }

  async forceLogout() {
    try {
      this.logger.log('Forzando cierre de sesión de WhatsApp...');

      if (this.sock) {
        try {
          await this.sock.logout();
        } catch {
          this.logger.log(
            'Error al cerrar la conexión, continuando con el proceso...',
          );
        }
        this.sock = null;
      }

      // Borrar archivos de autenticación
      const fs = await import('fs');
      const authPath = 'auth_info_baileys';
      if (fs.existsSync(authPath)) {
        try {
          fs.rmSync(authPath, { recursive: true, force: true });
          this.logger.log('Datos de autenticación borrados exitosamente');
        } catch (error) {
          this.logger.error('Error al borrar datos de autenticación', error);
          throw new Error('Error al borrar los datos de autenticación');
        }
      }

      this.connectionStatus = 'disconnected';
      this.qrCode = null;

      await this.initializeConnection();

      return {
        success: true,
        message:
          'Sesión cerrada y datos borrados. Se generará un nuevo QR.',
      };
    } catch (error) {
      this.logger.error('Error al forzar cierre de sesión', error);
      return {
        success: false,
        error: error.message || 'Error al forzar el cierre de sesión',
      };
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Eliminar todos los caracteres no numéricos
    let cleaned = phone.replace(/\D/g, '');

    // Si el número tiene 10 dígitos (México sin código de país), agregar 52
    if (cleaned.length === 10) {
      cleaned = '52' + cleaned;
    }

    // Si el número tiene 12 dígitos y comienza con 52, agregar 1 después del código de país
    if (cleaned.length === 12 && cleaned.startsWith('52')) {
      cleaned = cleaned.slice(0, 2) + '1' + cleaned.slice(2);
    }

    return `${cleaned}@s.whatsapp.net`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
