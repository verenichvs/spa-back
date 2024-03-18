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
    this.server.emit;
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
    this.server.emit('comments', comments);
  }
}
