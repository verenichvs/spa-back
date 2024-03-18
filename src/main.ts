import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketIoAdapter } from './comments/custom-socket-io-adapter';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: process.env.FRONTEND_APPLICATION,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,Access-Control-Allow-Origin',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  await app.listen(4000);
}
bootstrap();
