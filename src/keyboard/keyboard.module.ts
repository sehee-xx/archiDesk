import { Module } from '@nestjs/common';
import { KeyboardService } from './keyboard.service';
import { KeyboardController } from './keyboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyboard } from './entities/keyboard.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Keyboard]), AwsModule],
  providers: [KeyboardService],
  controllers: [KeyboardController],
})
export class KeyboardModule {}
