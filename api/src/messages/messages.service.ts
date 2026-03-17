import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // - Create new message
  // - Associate with User and Room
  async createMessage({ content, username, roomName }: CreateMessageDto) {
    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) user = await this.prisma.user.create({ data: { username } });

    // Find or create room
    let room = await this.prisma.room.findUnique({ where: { name: roomName } });
    if (!room)
      room = await this.prisma.room.create({ data: { name: roomName } });

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        content,
        userId: user.id,
        roomId: room.id,
      },
      include: {
        user: true,
        room: true,
      },
    });

    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      user: {
        id: message.user.id,
        username: message.user.username,
      },
      roomName: message.room.name,
    };
  }

  async getMessagesByRoom(roomName: string) {
    const room = await this.prisma.room.findUnique({
      where: { name: roomName },
    });
    if (!room) return [];

    const messages = await this.prisma.message.findMany({
      where: { roomId: room.id },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((msg) => {
      return {
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt,
        user: {
          id: msg.user.id,
          username: msg.user.username,
        },
      };
    });
  }
}
