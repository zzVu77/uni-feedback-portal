import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClarificationCreatedEvent } from './events/clarification-created.event';
import { ClarificationMessageSentEvent } from './events/clarification-message-sent.event';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'https://uniportal.vucoder77.id.vn'],
    credentials: true,
  },
})
export class ClarificationsGateway {
  @WebSocketServer()
  server: Server;

  // Khi user connect → join room theo userId
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      await client.join(userId);
      console.log(`User ${userId} joined room`);
    }
  }

  notifyClarificationCreated(userId: string, event: ClarificationCreatedEvent) {
    this.server.to(userId).emit('clarification.created', event);
  }

  notifyClarificationMessage(
    userId: string,
    event: ClarificationMessageSentEvent,
  ) {
    this.server.to(userId).emit('clarification.message_sent', event);
  }
}
