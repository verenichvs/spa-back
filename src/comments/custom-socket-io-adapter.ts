import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    options = {
      ...options,
      cors: {
        origin: process.env.FRONTEND_APPLICATION,
        methods: ['GET', 'POST'],
      },
    };
    return super.createIOServer(port, options);
  }
}
