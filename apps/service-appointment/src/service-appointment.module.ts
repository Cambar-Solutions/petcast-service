import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceAppointmentController } from './service-appointment.controller';
import { ServiceAppointmentService } from './service-appointment.service';
import { AppointmentsModule } from './appointments/appointments.module';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AppointmentsModule,
  ],
  controllers: [ServiceAppointmentController],
  providers: [ServiceAppointmentService],
})
export class ServiceAppointmentModule {}
