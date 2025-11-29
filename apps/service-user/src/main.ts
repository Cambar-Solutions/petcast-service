import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ServiceUserModule } from './service-user.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceUserModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors();

  const port = process.env.SERVICE_USER_PORT ?? 4201;
  await app.listen(port);
  console.log(`Service User running on port ${port}`);
}
bootstrap();
