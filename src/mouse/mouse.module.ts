import { Module } from '@nestjs/common';
import { MouseService } from './mouse.service';
import { MouseController } from './mouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mouse } from './entities/mouse.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mouse]), AwsModule],
  providers: [MouseService],
  controllers: [MouseController],
})
export class MouseModule {}
