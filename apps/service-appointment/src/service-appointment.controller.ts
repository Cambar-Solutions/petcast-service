import { Controller, Get } from '@nestjs/common';
import { ServiceAppointmentService } from './service-appointment.service';

@Controller()
export class ServiceAppointmentController {
  constructor(private readonly serviceAppointmentService: ServiceAppointmentService) {}

  @Get()
  getHello(): string {
    return this.serviceAppointmentService.getHello();
  }
}
