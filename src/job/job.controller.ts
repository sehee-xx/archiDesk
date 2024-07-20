import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JobService } from './job.service';
import { JobDto } from './dto/jobGet.dto';
import { Job } from './entities/job.entity';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async postUserJob(@Body() jobData: JobDto): Promise<JobDto> {
    return this.jobService.postUserJob(jobData);
  }

  @Get('/:userId')
  async getUserJob(@Param('userId') userId: string): Promise<Job> {
    return this.jobService.getUserJob(userId);
  }
}
