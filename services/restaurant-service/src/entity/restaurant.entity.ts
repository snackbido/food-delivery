import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItem } from '@restaurant/entity/menu_item.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ type: 'text', array: true })
  images: string[];

  @Column({ default: true })
  is_active: boolean;

  @Column('float', { default: 0 })
  rating: number;

  @Column({ default: 0 })
  total_reviews: number;

  @Column('jsonb', { nullable: true })
  confirm_order: {
    order_id: string;
    is_confirmed: boolean;
  };

  @Column('jsonb', { nullable: true })
  opening_hours: {
    [key: string]: {
      open: string;
      close: string;
      is_closed: boolean;
    };
  };

  @Column({ default: 30 })
  estimated_delivery_time: number;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
  menu_items: MenuItem[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
