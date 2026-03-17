import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Post('login')
  async login(@Body('username') username: string) {
    if (!username || username.trim().length < 3)
      return { error: 'Username must be at least 3 characters' };

    let user = await this.prisma.user.findUnique({ where: { username } });
    if (!user)
      user = await this.prisma.user.create({
        data: { username: username.trim() },
      });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  @Get()
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
  }
}
