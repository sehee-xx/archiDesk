import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { PostCreateDto } from './dto/postCreate.dto';
import { S3 } from 'aws-sdk';
import { PostUpdateDto } from './dto/postUpdate.dto';
import { CommentDto } from './dto/comment.dto';
import { Comments } from './entities/comments.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Posts)
    private readonly boardRepository: Repository<Posts>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @Inject('AWS S3') private readonly s3: S3,
  ) {}

  async postUploadBoard(
    file: Express.Multer.File,
    boardData: PostCreateDto,
  ): Promise<PostCreateDto> {
    const { originalname, mimetype } = file;
    const bucketS3 = 'archidesk';

    const uploadResult = await this.s3
      .upload({
        Bucket: bucketS3,
        Body: file.buffer,
        Key: `${Date.now()}_${originalname}`,
        ContentType: mimetype,
        ACL: 'public-read',
      })
      .promise();

    const newPost = new PostCreateDto();
    newPost.userId = boardData.userId;
    newPost.writer = boardData.writer;
    newPost.title = boardData.title;
    newPost.content = boardData.content;
    newPost.img = uploadResult.Location;

    const newImg = this.boardRepository.create(newPost);
    return this.boardRepository.save(newImg);
  }

  async getAllPosts(): Promise<Posts[]> {
    return this.boardRepository.find({
      relations: ['comments', 'user', 'user.job'],
      order: { created_at: 'DESC' },
    });
  }

  async getOnePost(postId: number): Promise<Posts> {
    return this.boardRepository.findOne({
      where: {
        postId: postId,
      },
      relations: ['comments'],
    });
  }

  async deleteS3File(img: string) {
    const key = img.split('/').pop();
    await this.s3
      .deleteObject({
        Bucket: 'archidesk',
        Key: key,
      })
      .promise();
  }

  async patchPost(
    postId: number,
    file: Express.Multer.File,
    updateData: PostUpdateDto,
  ): Promise<Posts> {
    const post = await this.boardRepository.findOneBy({ postId });
    if (file) {
      await this.deleteS3File(post.img);

      const { originalname, mimetype } = file;
      const uploadResult = await this.s3
        .upload({
          Bucket: 'archidesk',
          Body: file.buffer,
          Key: `${Date.now()}_${originalname}`,
          ContentType: mimetype,
          ACL: 'public-read',
        })
        .promise();
      post.img = uploadResult.Location;
    }
    this.boardRepository.merge(post, updateData);
    return await this.boardRepository.save(post);
  }

  async deletePost(postId: number): Promise<boolean> {
    const post = await this.boardRepository.findOneBy({ postId });
    if (post.img) {
      await this.deleteS3File(post.img);
    }
    await this.boardRepository.delete(postId);
    return true;
  }

  async commentUpload(commentData: CommentDto): Promise<Comments> {
    const newComment = new Comments();
    newComment.postId = commentData.postId;
    newComment.writer = commentData.writer;
    newComment.content = commentData.content;

    const createComment = this.commentRepository.create(newComment);
    return this.commentRepository.save(createComment);
  }

  async commentDelete(commentId: number): Promise<boolean> {
    const comment = await this.commentRepository.findOneBy({ commentId });
    await this.commentRepository.delete(comment);
    return true;
  }
}
