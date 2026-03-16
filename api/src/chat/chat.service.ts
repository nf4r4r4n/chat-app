import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  create(createMessageDto: any) {
    return { msg: 'Create message', body: createMessageDto };
  }

  findAll() {
    return { msg: 'Find all messages' };
  }
}
