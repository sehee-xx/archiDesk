import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keyboard } from './entities/keyboard.entity';
import { Like, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { KeyboardUploadDto } from './dto/keyboardUpload.dto';

@Injectable()
export class KeyboardService {
  constructor(
    @InjectRepository(Keyboard)
    private readonly keyboardRepository: Repository<Keyboard>,
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

  async uploadKeyboard(
    files: Express.Multer.File[],
    keyboardData: KeyboardUploadDto,
  ): Promise<KeyboardUploadDto> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    const fileUrls = await Promise.all(uploadPromises);

    const newKeyboard = new KeyboardUploadDto();
    newKeyboard.keyboardName = keyboardData.keyboardName;
    newKeyboard.price = keyboardData.price;
    newKeyboard.img = fileUrls;
    newKeyboard.madeBy = keyboardData.madeBy;
    newKeyboard.useFor = keyboardData.useFor;

    const keyboardNew = this.keyboardRepository.create(newKeyboard);
    return this.keyboardRepository.save(keyboardNew);
  }

  async getAll(): Promise<Keyboard[]> {
    return this.keyboardRepository.find();
  }

  async getOne(keyboardId: number): Promise<Keyboard> {
    return this.keyboardRepository.findOneBy({ keyboardId });
  }

  async searchKeyboard(search: string): Promise<Keyboard[]> {
    // 디버깅 로그 추가

    const keyboards = await this.keyboardRepository.find({
      where: [
        { keyboardName: Like(`%${search}%`) },
        { madeBy: Like(`%${search}%`) },
        { useFor: Like(`%${search}%`) },
      ],
    });

    return keyboards.map((keyboard) => ({
      keyboardId: keyboard.keyboardId,
      keyboardName: keyboard.keyboardName,
      price: keyboard.price,
      img: keyboard.img,
      madeBy: keyboard.madeBy,
      useFor: keyboard.useFor,
    }));
  }
}
