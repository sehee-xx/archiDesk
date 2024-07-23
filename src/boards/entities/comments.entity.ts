import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './posts.entity';

@Entity()
export class Comments {
  @Column()
  postId: number;
  @PrimaryGeneratedColumn()
  commentId: number;
  @Column()
  writer: string;
  @Column()
  content: string;
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @ManyToOne(() => Posts, (post) => post.comments)
  @JoinColumn({ name: 'postId', referencedColumnName: 'postId' })
  post: Posts;
}
