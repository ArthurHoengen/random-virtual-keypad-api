import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('digit')
export class Digit {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('int', { array: true })
  digits: Array<Array<number>>;

  @Column('varchar')
  hash: string;

  @Column('boolean', { default: false })
  used: boolean;
}
