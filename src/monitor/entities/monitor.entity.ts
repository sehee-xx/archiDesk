import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Monitor {
  @PrimaryGeneratedColumn()
  monitorId: number;

  @Column()
  monitorName: string;

  @Column()
  price: number;

  @Column('simple-array')
  img: string[];

  @Column()
  madeBy: string;

  @Column()
  useFor: string;
}
