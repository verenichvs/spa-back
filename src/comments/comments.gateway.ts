import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { CommentsService } from './comments.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class CommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    // Enable CORS for WebSocket
    this.server.emit('headers', {
      'Access-Control-Allow-Origin': process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
      'Access-Control-Allow-Credentials': 'true',
    });
  }
  constructor(private readonly commentsService: CommentsService) {}
  handleDisconnect(client: any) {
    console.log('socket disconected');
  }

  afterInit(server: Server) {
    console.log('Socket.io server initialized');
  }

  @SubscribeMessage('getComments')
  async handleGetComments(client: any) {
    const comments = await this.commentsService.getAllComments();
    this.server.emit('comments', comments); // Отправляем комментарии клиенту через WebSocket
  }
}
