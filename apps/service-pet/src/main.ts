import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ServicePetModule } from './service-pet.module';

async function bootstrap() {
  const app = await NestFactory.create(ServicePetModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();

  const port = process.env.SERVICE_PET_PORT ?? 4202;
  await app.listen(port, '0.0.0.0');
  console.log(`Service Pet running on port ${port}`);
}
bootstrap();
