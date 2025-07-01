import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderItem } from '@order/entity/order-items.entity';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
  constructor(private dataSource: DataSource) {
    super(OrderItem, dataSource.createEntityManager());
  }
}
