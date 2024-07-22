import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Like, Repository } from 'typeorm';
import { MouseUploadDto } from './dto/mouseUpload.dto';
import { Mouse } from './entities/mouse.entity';

@Injectable()
export class MouseService {
  constructor(
    @InjectRepository(Mouse)
    private readonly mouseRepository: Repository<Mouse>,
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

  async uploadMouse(
    files: Express.Multer.File[],
    mouseData: MouseUploadDto,
  ): Promise<MouseUploadDto> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    const fileUrls = await Promise.all(uploadPromises);

    const newMouse = new MouseUploadDto();
    newMouse.mouseName = mouseData.mouseName;
    newMouse.price = mouseData.price;
    newMouse.img = fileUrls;
    newMouse.madeBy = mouseData.madeBy;
    newMouse.useFor = mouseData.useFor;

    const mouseNew = this.mouseRepository.create(newMouse);
    return this.mouseRepository.save(mouseNew);
  }

  async getAll(): Promise<Mouse[]> {
    return this.mouseRepository.find();
  }

  async getOne(mouseId: number): Promise<Mouse> {
    return this.mouseRepository.findOneBy({ mouseId });
  }

  async searchMouse(search: string): Promise<Mouse[]> {
    const mouses = await this.mouseRepository.find({
      where: [
        { mouseName: Like(`%${search}%`) },
        { madeBy: Like(`%${search}%`) },
        { useFor: Like(`%${search}%`) },
      ],
    });

    return mouses.map((mouse) => ({
      mouseId: mouse.mouseId,
      mouseName: mouse.mouseName,
      price: mouse.price,
      img: mouse.img,
      madeBy: mouse.madeBy,
      useFor: mouse.useFor,
    }));
  }
}
