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
import { FilesInterceptor } from '@nestjs/platform-express';
import { MouseUploadDto } from './dto/mouseUpload.dto';
import { MouseService } from './mouse.service';
import { Mouse } from './entities/mouse.entity';

@Controller('mouse')
export class MouseController {
  constructor(private readonly mouseService: MouseService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMouse(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() mouseData: MouseUploadDto,
  ): Promise<MouseUploadDto> {
    return this.mouseService.uploadMouse(files, mouseData);
  }

  @Get('search')
  async searchMonitor(@Query('q') search: string): Promise<Mouse[]> {
    return this.mouseService.searchMouse(search);
  }

  @Get()
  async getAll(): Promise<Mouse[]> {
    return this.mouseService.getAll();
  }

  @Get('/:id')
  async getOne(@Param('id') mouseId: number): Promise<Mouse> {
    return this.mouseService.getOne(mouseId);
  }
}
