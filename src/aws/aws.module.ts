import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Module({
  providers: [
    {
      provide: 'AWS S3',
      useFactory: () => {
        return new S3({
          accessKeyId: process.env.S3_ACCESSKEY,
          secretAccessKey: process.env.S3_SECRET_ACCESSKEY,
          region: 'ap-northeast-2',
        });
      },
    },
  ],
  exports: ['AWS S3'],
})
export class AwsModule {}
