import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Index(['name', 'type'])
@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;
}
