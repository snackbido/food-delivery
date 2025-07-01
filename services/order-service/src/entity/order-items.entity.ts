import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '@order/entity/order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @Column()
  item_id: string;

  @Column()
  name: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number; // price * quantity

  @ManyToOne(() => Order, (order) => order.items, { cascade: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn()
  created_at: Date;
}
