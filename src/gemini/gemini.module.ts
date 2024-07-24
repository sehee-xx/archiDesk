import { Module } from '@nestjs/common';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';

import { ConfigModule } from '@nestjs/config';
import { DeskModule } from 'src/desk/desk.module';

@Module({
  imports: [ConfigModule.forRoot(), DeskModule],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}
