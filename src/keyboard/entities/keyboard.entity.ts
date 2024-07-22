import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Keyboard {
  @PrimaryGeneratedColumn()
  keyboardId: number;

  @Column()
  keyboardName: string;

  @Column()
  price: number;

  @Column('simple-array')
  img: string[];

  @Column()
  madeBy: string;

  @Column()
  useFor: string;
}
