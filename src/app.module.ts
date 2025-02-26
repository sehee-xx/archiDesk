import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobModule } from './job/job.module';
import { User } from './auth/entities/user.entity';
import { Job } from './job/entities/job.entity';
import { BoardsModule } from './boards/boards.module';
import { AwsModule } from './aws/aws.module';
import { Posts } from './boards/entities/posts.entity';
import { Comments } from './boards/entities/comments.entity';
import { DeskModule } from './desk/desk.module';
import { MonitorModule } from './monitor/monitor.module';
import { KeyboardModule } from './keyboard/keyboard.module';
import { MouseModule } from './mouse/mouse.module';
import { Desk } from './desk/entities/desk.entity';
import { Monitor } from './monitor/entities/monitor.entity';
import { Keyboard } from './keyboard/entities/keyboard.entity';
import { Mouse } from './mouse/entities/mouse.entity';
import { GeminiModule } from './gemini/gemini.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: process.env.MYSQL_PW,
      database: 'archidesk',
      entities: [User, Job, Posts, Comments, Desk, Monitor, Keyboard, Mouse],
      synchronize: true,
      driver: require('mysql2'),
    }),
    AuthModule,
    JobModule,
    BoardsModule,
    AwsModule,
    DeskModule,
    MonitorModule,
    KeyboardModule,
    MouseModule,
    GeminiModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
