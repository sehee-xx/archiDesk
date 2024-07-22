import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mouse {
  @PrimaryGeneratedColumn()
  mouseId: number;

  @Column()
  mouseName: string;

  @Column()
  price: number;

  @Column('simple-array')
  img: string[];

  @Column()
  madeBy: string;

  @Column()
  useFor: string;
}
