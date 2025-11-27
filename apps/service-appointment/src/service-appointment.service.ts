import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceAppointmentService {
  getHello(): string {
    return 'Hello World!';
  }
}
