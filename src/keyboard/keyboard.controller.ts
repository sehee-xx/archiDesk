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
import { KeyboardService } from './keyboard.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { KeyboardUploadDto } from './dto/keyboardUpload.dto';
import { Keyboard } from './entities/keyboard.entity';

@Controller('keyboard')
export class KeyboardController {
  constructor(private readonly keyboardService: KeyboardService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadDesk(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() keyboardData: KeyboardUploadDto,
  ): Promise<KeyboardUploadDto> {
    return this.keyboardService.uploadKeyboard(files, keyboardData);
  }

  @Get('search')
  async searchKeyboard(@Query('q') search: string): Promise<Keyboard[]> {
    return this.keyboardService.searchKeyboard(search);
  }

  @Get()
  async getAll(): Promise<Keyboard[]> {
    return this.keyboardService.getAll();
  }

  @Get('/:id')
  async getOne(@Param('id') keyboardId: number): Promise<Keyboard> {
    return this.keyboardService.getOne(keyboardId);
  }
}
