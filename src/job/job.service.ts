import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm';
import { JobDto } from './dto/jobGet.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async postUserJob(jobData: JobDto): Promise<JobDto> {
    const newJob = this.jobRepository.create(jobData);
    return this.jobRepository.save(newJob);
  }

  async getUserJob(userId: string): Promise<Job> {
    const userJob = this.jobRepository.findOneBy({ userId });
    return userJob;
  }
}
