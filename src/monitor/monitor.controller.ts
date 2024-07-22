import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MonitorUploadDto } from './dto/monitorUpload.dto';
import { Monitor } from './entities/monitor.entity';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMonitor(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() monitorData: MonitorUploadDto,
  ): Promise<MonitorUploadDto> {
    return this.monitorService.uploadMonitor(files, monitorData);
  }

  @Get('search')
  async searchMonitor(@Query('q') search: string): Promise<Monitor[]> {
    return this.monitorService.searchMonitor(search);
  }

  @Get()
  async getAll(): Promise<Monitor[]> {
    return this.monitorService.getAll();
  }

  @Get('/:id')
  async getOne(@Param('id') deskId: number): Promise<Monitor> {
    return this.monitorService.getOne(deskId);
  }
}
