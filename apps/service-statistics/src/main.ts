import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ServiceStatisticsModule } from './service-statistics.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceStatisticsModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();
  app.setGlobalPrefix('api');

  const port = process.env.SERVICE_STATISTICS_PORT ?? 3004;
  await app.listen(port);
  console.log(`Service Statistics running on port ${port}`);
}
bootstrap();
