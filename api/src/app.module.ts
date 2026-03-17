import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesService } from './messages/messages.service';
import { ChatGateway } from './chat/chat.gateway';
import { PrismaService } from './prisma/prisma.service';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, RoomsModule],
  controllers: [AppController],
  providers: [
    AppService,
    MessagesService,
    ChatGateway,
    PrismaService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // delete undefined properties
        forbidNonWhitelisted: true,
        transform: true, // Transform automaticaly types
      }),
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
