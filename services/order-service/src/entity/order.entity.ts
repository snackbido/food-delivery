import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from '@order/entity/order-items.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  DELIVERING = 'delivering',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  restaurant_id: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  delivery_fee: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('json')
  delivery_address: {
    name: string;
    lat: number;
    lng: number;
  };

  @Column({ nullable: true })
  estimated_delivery_time: Date;

  @Column({ nullable: true })
  delivery_person_id: string;

  @Column({ nullable: true })
  payment_id: string;

  @Column({ default: false })
  is_paid: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
