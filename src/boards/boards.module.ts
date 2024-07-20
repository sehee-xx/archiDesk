import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { Comments } from './entities/comments.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Comments]), AwsModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
