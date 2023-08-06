import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket/socket.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer()
  private wss: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server): void {
    this.logger.log('Initialized!');
    this.socketService.setWss(server);
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleMessage(client: Socket, batchId: string): void {
    client.join(batchId);
    this.wss.to(batchId).emit('joined', {
      socketId: client.id,
      room: batchId,
      status: 'joined',
    });
  }
}
