import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ServiceAppointmentModule } from './service-appointment.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceAppointmentModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();

  const port = process.env.SERVICE_APPOINTMENT_PORT ?? 3003;
  await app.listen(port);
  console.log(`Service Appointment running on port ${port}`);
}
bootstrap();
