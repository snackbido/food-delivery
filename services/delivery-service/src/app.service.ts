import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Delivery,
  DeliveryDocument,
  DeliveryStatus,
} from '@delivery/entity/delivery.entity';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Producer } from '@delivery/shared/queue/producer.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
    private producer: Producer,
  ) {}

  async findAll(): Promise<DeliveryDocument[]> {
    return await this.deliveryModel.find();
  }

  async findOne(id: string): Promise<DeliveryDocument> {
    const delivery = await this.deliveryModel.findById(id);

    if (!delivery) throw new RpcException('Document not found');

    return delivery;
  }

  async assignDelivery(deliveryId: string) {
    const delivery = await this.findOne(deliveryId);

    if (delivery.status !== DeliveryStatus.PENDING)
      throw new RpcException('Delivery is not pending');

    await delivery.updateOne(
      {
        status: DeliveryStatus.ASSIGNED,
        assigned_at: Date.now(),
      },
      { new: true },
    );

    return delivery;
  }

  async pickedUpDelivery(deliveryId: string) {
    const delivery = await this.findOne(deliveryId);

    if (delivery.status !== DeliveryStatus.ASSIGNED)
      throw new RpcException('Delivery must have assign status');

    await delivery.updateOne(
      {
        status: DeliveryStatus.PICKED_UP,
        assigned_at: Date.now(),
      },
      { new: true },
    );

    return delivery;
  }

  async inDelivery(deliveryId: string) {
    const delivery = await this.findOne(deliveryId);

    if (delivery.status !== DeliveryStatus.PICKED_UP)
      throw new RpcException('Delivery must have assign status');

    await delivery.updateOne(
      {
        status: DeliveryStatus.IN_TRANSIT,
        assigned_at: Date.now(),
      },
      { new: true },
    );

    return delivery;
  }

  async delivered(deliveryId: string): Promise<string> {
    const delivery = await this.findOne(deliveryId);

    if (delivery.status !== DeliveryStatus.IN_TRANSIT)
      throw new RpcException('Delivery must have assign status');

    await delivery.updateOne(
      {
        status: DeliveryStatus.DELIVERED,
        assigned_at: Date.now(),
      },
      { new: true },
    );

    const channel = await this.producer.connect();
    await this.producer.publishExchangeMessage(
      channel,
      'delivery-delivered',
      'delivery',
      JSON.stringify({
        type: 'delivery-delivered',
        data: delivery,
      }),
      'direct',
    );
    return 'Đơn hàng đã được giao';
  }
}
