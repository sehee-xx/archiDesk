import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryColumn()
  userId: string;
  @Column()
  userJob: string;
  @OneToOne(() => User, (user) => user.job)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;
}
