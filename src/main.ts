import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Укажите ваше фронтенд-приложение
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);
  await app.listen(4000);
}
bootstrap();
