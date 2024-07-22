import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Desk } from './entities/desk.entity';
import { Between, Like, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { DeskUploadDto } from './dto/deskUpload.dto';
import { PriceRangeDto } from './dto/price.dto';

@Injectable()
export class DeskService {
  constructor(
    @InjectRepository(Desk)
    private readonly deskRepository: Repository<Desk>,
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

  async uploadDesk(
    files: Express.Multer.File[],
    deskData: DeskUploadDto,
  ): Promise<DeskUploadDto> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    const fileUrls = await Promise.all(uploadPromises);

    const newDesk = new DeskUploadDto();
    newDesk.deskName = deskData.deskName;
    newDesk.price = deskData.price;
    newDesk.img = fileUrls;
    newDesk.madeBy = deskData.madeBy;
    newDesk.useFor = deskData.useFor;

    const deskNew = this.deskRepository.create(newDesk);
    return this.deskRepository.save(deskNew);
  }

  async getAll(): Promise<Desk[]> {
    return this.deskRepository.find();
  }

  async getOne(deskId: number): Promise<Desk> {
    return this.deskRepository.findOneBy({ deskId });
  }

  async searchDesk(search: string): Promise<Desk[]> {
    // 디버깅 로그 추가

    const desks = await this.deskRepository.find({
      where: [
        { deskName: Like(`%${search}%`) },
        { madeBy: Like(`%${search}%`) },
        { useFor: Like(`%${search}%`) },
      ],
    });

    return desks.map((desk) => ({
      deskId: desk.deskId,
      deskName: desk.deskName,
      price: desk.price,
      img: desk.img,
      madeBy: desk.madeBy,
      useFor: desk.useFor,
    }));
  }

  async getDesksByPriceRange(priceData: PriceRangeDto): Promise<Desk[]> {
    const { minPrice, maxPrice } = priceData;

    const desks = await this.deskRepository.find({
      where: {
        price: Between(minPrice, maxPrice),
      },
    });
    return desks;
  }
}
