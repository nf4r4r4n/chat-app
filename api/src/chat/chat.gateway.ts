import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';

interface ConnectedUser {
  sockerId: string;
  username: string;
}

interface CreateRoomPayload {
  roomName: string;
  username: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  constructor(private messageService: MessagesService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`User connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // Find which user was connecting
    for (const [username, sockerId] of this.connectedUsers.entries()) {
      if (sockerId === client.id) {
        this.connectedUsers.delete(username);
        this.logger.log(`${username} just disconnected`);
      }
    }
  }

  // Join room
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; username: string },
  ) {
    const { roomName, username } = payload;

    if (!username || !roomName) {
      client.emit('error', { message: 'username and roomName are required' });
      return;
    }

    // Join the room
    client.join(roomName);

    // Save that the user is connected
    this.connectedUsers.set(username, client.id);

    this.logger.log(`${username} join the room: ${roomName}`);

    // Send messages historic to the newly joined user
    const history = await this.messageService.getMessagesByRoom(roomName);
    client.emit('roomHistory', history);

    // Notify all room's users (expect the newly joined)
    client.to(roomName).emit('userJoined', {
      username,
      message: `${username} joined the room`,
    });
  }

  // Send message
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateMessageDto,
  ) {
    const { roomName, content, username } = payload;

    if (!content?.trim() || !username || !roomName) {
      client.emit('error', { message: 'Invalid message' });
      return;
    }

    try {
      const savedMessage = await this.messageService.createMessage({
        content: content.trim(),
        username,
        roomName,
      });

      // Broadcast to all room's users (with the sender)
      this.server.to(roomName).emit('newMessage', savedMessage);

      this.logger.log(`${username}'s message in ${roomName}`);
    } catch (error) {
      this.logger.error('Error has been occured while sending message', error);
      client.emit('error', {
        message: 'Error has been occured while sending message',
      });
    }
  }

  // Leave the room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; username: string },
  ) {
    const { roomName, username } = payload;
    client.leave(roomName);

    this.server.to(roomName).emit('userLeft', {
      username,
      message: `${username} left the room`,
    });

    this.logger.log(`${username} left the room: ${roomName}`);
  }
}
