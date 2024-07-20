import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  postId: number;
  @Column()
  userId: string;
  @Column()
  writer: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ type: 'text' })
  img: string;
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @OneToMany(() => Comments, (comment) => comment.post)
  @JoinColumn({ name: 'postId', referencedColumnName: 'postId' })
  comments: Comments[];
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;
}
