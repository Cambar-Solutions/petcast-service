import { Controller, Post, Body, Get } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import {
  SendMessageDto,
  SendBulkMessageDto,
  SendAppointmentReminderDto,
  SendVaccinationReminderDto,
  SendReminderDto,
} from './dto/send-message.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send-message')
  async sendMessage(@Body() body: SendMessageDto) {
    return await this.whatsappService.sendMessage(body.phone, body.message);
  }

  @Post('send-bulk-message')
  async sendBulkMessage(@Body() body: SendBulkMessageDto) {
    return await this.whatsappService.sendBulkMessage(body.phones, body.message);
  }

  @Post('send-appointment-reminder')
  async sendAppointmentReminder(@Body() body: SendAppointmentReminderDto) {
    return await this.whatsappService.sendAppointmentReminder(body);
  }

  @Post('send-vaccination-reminder')
  async sendVaccinationReminder(@Body() body: SendVaccinationReminderDto) {
    return await this.whatsappService.sendVaccinationReminder(body);
  }

  @Post('send-reminder')
  async sendReminder(@Body() body: SendReminderDto) {
    return await this.whatsappService.sendReminderByType(
      body.phone,
      body.tipo,
      body.nombreDueno,
      body.nombreMascota,
      {
        fechaCita: body.fechaCita,
        motivo: body.motivo,
        nombreVacuna: body.nombreVacuna,
        proximaFecha: body.proximaFecha,
      },
    );
  }

  @Post('send-appointment-confirmation')
  async sendAppointmentConfirmation(
    @Body()
    body: {
      phone: string;
      nombreDueno: string;
      nombreMascota: string;
      fechaCita: string;
      horaCita: string;
    },
  ) {
    return await this.whatsappService.sendAppointmentConfirmation(
      body.phone,
      body.nombreDueno,
      body.nombreMascota,
      body.fechaCita,
      body.horaCita,
    );
  }

  @Post('send-appointment-cancellation')
  async sendAppointmentCancellation(
    @Body()
    body: {
      phone: string;
      nombreDueno: string;
      nombreMascota: string;
      fechaCita: string;
    },
  ) {
    return await this.whatsappService.sendAppointmentCancellation(
      body.phone,
      body.nombreDueno,
      body.nombreMascota,
      body.fechaCita,
    );
  }

  @Post('send-followup')
  async sendFollowUp(
    @Body()
    body: {
      phone: string;
      nombreDueno: string;
      nombreMascota: string;
      indicaciones?: string;
    },
  ) {
    return await this.whatsappService.sendFollowUp(
      body.phone,
      body.nombreDueno,
      body.nombreMascota,
      body.indicaciones,
    );
  }

  @Post('send-recovery-code')
  async sendRecoveryCode(
    @Body()
    body: {
      phone: string;
      nombreUsuario: string;
      codigo: string;
    },
  ) {
    return await this.whatsappService.sendPasswordRecoveryCode(
      body.phone,
      body.nombreUsuario,
      body.codigo,
    );
  }

  @Get('qr')
  getQRCode() {
    const qrCode = this.whatsappService.getQRCode();
    const status = this.whatsappService.getConnectionStatus();

    return {
      qrCode,
      ...status,
    };
  }

  @Get('status')
  getStatus() {
    return this.whatsappService.getConnectionInfo();
  }

  @Post('force-logout')
  async forceLogout() {
    return await this.whatsappService.forceLogout();
  }
}
