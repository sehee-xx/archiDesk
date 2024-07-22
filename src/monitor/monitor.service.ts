import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Monitor } from './entities/monitor.entity';
import { MonitorUploadDto } from './dto/monitorUpload.dto';
import { Like, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(Monitor)
    private readonly monitorRepository: Repository<Monitor>,
    @Inject('AWS S3') private readonly s3: S3,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: 'archidesk',
      Key: `${Date.now()}-${file.originalname}`, // unique key for each file
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // to allow public access to the file
    };

    const data = await this.s3.upload(params).promise();
    return data.Location; // URL of the uploaded file
  }

  async uploadMonitor(
    files: Express.Multer.File[],
    monitorData: MonitorUploadDto,
  ): Promise<MonitorUploadDto> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    const fileUrls = await Promise.all(uploadPromises);

    const newMonitor = new MonitorUploadDto();
    newMonitor.monitorName = monitorData.monitorName;
    newMonitor.price = monitorData.price;
    newMonitor.img = fileUrls;
    newMonitor.madeBy = monitorData.madeBy;
    newMonitor.useFor = monitorData.useFor;

    const monitorNew = this.monitorRepository.create(newMonitor);
    return this.monitorRepository.save(monitorNew);
  }

  async getAll(): Promise<Monitor[]> {
    return this.monitorRepository.find();
  }

  async getOne(monitorId: number): Promise<Monitor> {
    return this.monitorRepository.findOneBy({ monitorId });
  }

  async searchMonitor(search: string): Promise<Monitor[]> {
    // 디버깅 로그 추가

    const monitors = await this.monitorRepository.find({
      where: [
        { monitorName: Like(`%${search}%`) },
        { madeBy: Like(`%${search}%`) },
        { useFor: Like(`%${search}%`) },
      ],
    });

    return monitors.map((monitor) => ({
      monitorId: monitor.monitorId,
      monitorName: monitor.monitorName,
      price: monitor.price,
      img: monitor.img,
      madeBy: monitor.madeBy,
      useFor: monitor.useFor,
    }));
  }
}
