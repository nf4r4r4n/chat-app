import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('rooms')
export class RoomsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async createRoom(@Body('name') name: string) {
    if (!name || name.trim().length < 2)
      return { error: 'Room name must be at least 2 characters' };

    try {
      const room = await this.prisma.room.create({
        data: { name: name.trim() },
      });

      return {
        success: true,
        room: {
          id: room.id,
          name: room.name,
        },
      };
    } catch (error) {
      return { error: 'Room already exists' };
    }
  }

  @Get()
  async getAllRooms() {
    return this.prisma.room.findMany({
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  @Get(':name')
  async getRoomByName(@Param('name') name: string) {
    return this.prisma.room.findMany({
      where: { name },
      select: { id: true, name: true },
    });
  }
}
