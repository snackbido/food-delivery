import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Restaurant } from '@restaurant/entity/restaurant.entity';
import { Category } from '@restaurant/entity/category.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('simple-array')
  images: string[];

  @Column({ default: true })
  is_available: boolean;

  @Column({ nullable: true })
  preparation_time: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu_items, {
    cascade: true,
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column()
  restaurant_id: string;

  @ManyToOne(() => Category, (category) => category.menu_items, {
    cascade: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  category_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
