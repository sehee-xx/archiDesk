import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Desk {
  @PrimaryGeneratedColumn()
  deskId: number;

  @Column()
  deskName: string;

  @Column()
  price: number;

  @Column('simple-array')
  img: string[];

  @Column()
  madeBy: string;

  @Column()
  useFor: string;
}
