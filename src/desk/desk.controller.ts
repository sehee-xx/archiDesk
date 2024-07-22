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
import { DeskService } from './desk.service';
import { DeskUploadDto } from './dto/deskUpload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Desk } from './entities/desk.entity';
import { PriceRangeDto } from './dto/price.dto';

@Controller('desk')
export class DeskController {
  constructor(private readonly deskService: DeskService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadDesk(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() deskData: DeskUploadDto,
  ): Promise<DeskUploadDto> {
    return this.deskService.uploadDesk(files, deskData);
  }

  @Get('search')
  async searchDesk(@Query('q') search: string): Promise<Desk[]> {
    return this.deskService.searchDesk(search);
  }

  @Get()
  async getAll(): Promise<Desk[]> {
    return this.deskService.getAll();
  }

  @Get('/:id')
  async getOne(@Param('id') deskId: number): Promise<Desk> {
    return this.deskService.getOne(deskId);
  }

  @Get('price-range')
  async getDesksByPriceRange(
    @Query() priceData: PriceRangeDto,
  ): Promise<Desk[]> {
    return this.deskService.getDesksByPriceRange(priceData);
  }
}
