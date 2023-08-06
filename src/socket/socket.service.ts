import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { BatchEntity } from '../batch/entity';

@Injectable()
export class SocketService {
  private wss: Server;

  setWss(wss: Server): void {
    this.wss = wss;
  }

  handleEmitBatch(batchId: string, batch: BatchEntity): void {
    this.wss.to(batchId).emit('batch', batch);
  }

  handleEmitSignout(batchId: string): void {
    this.wss.to(batchId).emit('signout');
  }
}
