import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { PostCreateDto } from './dto/postCreate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Posts } from './entities/posts.entity';
import { PostUpdateDto } from './dto/postUpdate.dto';
import { CommentDto } from './dto/comment.dto';
import { Comments } from './entities/comments.entity';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardService: BoardsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async postUploadBoard(
    @UploadedFile() file: Express.Multer.File,
    @Body() boardData: PostCreateDto,
  ): Promise<PostCreateDto> {
    return this.boardService.postUploadBoard(file, boardData);
  }

  @Get()
  async getAllPosts(): Promise<Posts[]> {
    return this.boardService.getAllPosts();
  }

  @Get('/:postId')
  async getOnePost(@Param('postId') postId: number): Promise<Posts> {
    return this.boardService.getOnePost(postId);
  }

  @Patch('/:postId')
  @UseInterceptors(FileInterceptor('file'))
  async patchPost(
    @Param('postId') postId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateData: PostUpdateDto,
  ): Promise<Posts> {
    return this.boardService.patchPost(postId, file, updateData);
  }

  @Delete('/:postId')
  async deletePost(@Param('postId') postId: number): Promise<boolean> {
    return this.boardService.deletePost(postId);
  }

  @Post('/comment/upload')
  async commentUpload(@Body() commentData: CommentDto): Promise<Comments> {
    return this.boardService.commentUpload(commentData);
  }

  @Delete('/comment/:commentId')
  async commentDelete(@Param('commentId') commentId: number): Promise<boolean> {
    return this.boardService.commentDelete(commentId);
  }

  @Get('search')
  async searchDesk(@Query('q') search: string): Promise<Posts[]> {
    console.log('쿼리', search);
    return this.boardService.searchPost(search);
  }
}
