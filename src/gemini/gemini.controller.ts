import { Controller, Get, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Get()
  async getRecommendations(
    @Query('job') job: string,
    @Query('page') page: string,
  ) {
    return this.geminiService.getRecommendationsByJob(job, page);
  }
}
