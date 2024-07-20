import { Job } from 'src/job/entities/job.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  userId: string;
  @Column()
  googleId: string;
  @Column()
  displayName: string;
  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;
  @OneToOne(() => Job, (job) => job.user)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  job: Job;
}
