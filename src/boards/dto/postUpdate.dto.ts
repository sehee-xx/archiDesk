import { PartialType } from '@nestjs/mapped-types';
import { PostCreateDto } from './postCreate.dto';

export class PostUpdateDto extends PartialType(PostCreateDto) {}
