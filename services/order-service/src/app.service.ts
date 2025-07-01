import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '@order/repository/order.repository';
import { Order, OrderStatus } from '@order/entity/order.entity';
import { RpcException } from '@nestjs/microservices';
import { CreateOrderDTO } from '@order/dto/create-order.dto';
import { OrderItemRepository } from '@order/repository/order-items.repository';
import { Producer } from '@order/shared/queue/producer.service';
import * as amqp from 'amqplib';
import { Consumer } from './shared/queue/consumer.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
    @InjectRepository(OrderItemRepository)
    private orderItemRepository: OrderItemRepository,
    private producer: Producer,
    private consumer: Consumer,
  ) {}

  async createChannel(): Promise<amqp.Channel> {
    return await this.producer.connect();
  }

  async findAll(userId?: string, restaurantId?: string): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items');

    if (userId) {
      query.where('order.user_id = :userId', { userId });
    }

    if (restaurantId) {
      query.andWhere('order.restaurant_id = :restaurantId', { restaurantId });
    }

    return query.orderBy('order.created_at', 'DESC').getMany();
  }

  async findOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) throw new RpcException('Order does not exists');
    return order;
  }

  async findOrderByUserId(userId: string): Promise<Order[]> {
    const orders = await this.orderRepository.findBy({ user_id: userId });

    if (!orders) throw new RpcException('Order does not exist');
    return orders;
  }

  async create(createOrderDto: CreateOrderDTO): Promise<string> {
    const subtotal = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * 1 * (item.quantity * 1),
      0,
    );

    const total = subtotal + createOrderDto.delivery_fee * 1;
    const order = this.orderRepository.create({
      user_id: createOrderDto.user_id,
      restaurant_id: createOrderDto.restaurant_id,
      delivery_address: createOrderDto.delivery_address,
      subtotal,
      delivery_fee: createOrderDto.delivery_fee * 1,
      total,
      status: OrderStatus.PENDING,
    });
    const savedOrder = await this.orderRepository.save(order);
    const orderItems = createOrderDto.items.map((item: any) => {
      const orderItem = this.orderItemRepository.create({
        order_id: savedOrder.id,
        item_id: item.item_id,
        name: item.name,
        quantity: item.quantity * 1,
        price: item.price * 1,
        total_price: item.price * 1 * (item.quantity * 1),
      });
      return orderItem;
    });
    await this.orderItemRepository.save(orderItems);
    const channel = await this.createChannel();
    await this.producer.publishExchangeMessage(
      channel,
      'order-payment-created',
      'order-payment',
      JSON.stringify({
        type: 'order-payment-created',
        data: savedOrder,
        method: createOrderDto.payment_method,
        gateway: createOrderDto.payment_gateway,
      }),
      'direct',
    );

    return 'Creating your order...';
  }

  async confirmedOrder(id: string): Promise<string> {
    const order = await this.findOrder(id);

    if (order.status !== OrderStatus.ACCEPTED) {
      throw new RpcException('Order must have confirm payment');
    }

    const channel = await this.createChannel();
    await this.producer.publishExchangeMessage(
      channel,
      'order-created',
      'order',
      JSON.stringify({ type: 'order-created', data: order }),
      'fanout',
    );

    return 'Waiting your order confirmed';
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (order.status === OrderStatus.DELIVERED) {
      throw new RpcException('Cannot cancel delivered order');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new RpcException('Order already cancelled');
    }

    const cancelledOrder = await this.orderRepository.save(
      {
        ...order,
        status: OrderStatus.CANCELLED,
      },
      { transaction: true },
    );

    // Send cancellation notification
    const channel = await this.createChannel();
    await this.producer.publishExchangeMessage(
      channel,
      'order-notification-cancelled',
      'order-notification',
      JSON.stringify({
        type: 'order-notification-cancelled',
        order: cancelledOrder,
      }),
      'direct',
    );

    return cancelledOrder; // Return with items
  }

  async getOrderStats(userId?: string, restaurantId?: string) {
    const query = this.orderRepository.createQueryBuilder('order');

    if (userId) {
      query.where('order.user_id = :userId', { userId });
    }

    if (restaurantId) {
      query.andWhere('order.restaurant_id = :restaurantId', { restaurantId });
    }

    const [totalOrders, totalRevenue] = await Promise.all([
      query.getCount(),
      query.select('SUM(order.total)', 'sum').getRawOne(),
    ]);

    const statusCounts = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    return {
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.sum) || 0,
      statusCounts,
    };
  }

  async confirmDelivery(orderId: string): Promise<string> {
    const order = await this.findOrder(orderId);

    if (order.status !== OrderStatus.READY)
      throw new RpcException('Order must have ready');

    order.status = OrderStatus.DELIVERING;
    await this.orderRepository.save(order);

    const channel = await this.createChannel();
    await this.consumer.consumePickupDriverDirectMessage(channel, order.id);
    await this.producer.publishExchangeMessage(
      channel,
      'order-delivery-delivering',
      'order-delivery',
      JSON.stringify({ data: order, type: 'order-delivery-delivering' }),
      'direct',
    );

    return 'Your order has been transfer for shipper';
  }

  async delete(id: string): Promise<string> {
    const order = await this.findOrder(id);

    await this.orderRepository.delete(order);

    return 'Order deleted successfully';
  }
}
