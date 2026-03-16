import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: any) {
    return this.chatService.create(createMessageDto);
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('join')
  joinRoom() {}
}
