import { Module } from '@nestjs/common';
import { DeskService } from './desk.service';
import { DeskController } from './desk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Desk } from './entities/desk.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Desk]), AwsModule],
  providers: [DeskService],
  controllers: [DeskController],
})
export class DeskModule {}
