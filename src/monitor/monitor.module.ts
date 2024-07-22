import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Monitor } from './entities/monitor.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Monitor]), AwsModule],
  providers: [MonitorService],
  controllers: [MonitorController],
})
export class MonitorModule {}
