import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeliveryDocument = Delivery & Document;

export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Delivery {
  @Prop({ required: true })
  order_id: string;

  @Prop({ required: true })
  customer_id: string;

  @Prop({ required: true })
  restaurant_id: string;

  @Prop()
  driver_id: string;

  @Prop({
    type: String,
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Prop({
    type: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  })
  pickup_location: {
    address: string;
    latitude: number;
    longitude: number;
  };

  @Prop({
    type: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  })
  delivery_location: {
    address: string;
    latitude: number;
    longitude: number;
  };

  @Prop()
  estimated_delivery_time: Date;

  @Prop()
  actual_delivery_time: Date;

  @Prop({ default: 0 })
  delivery_fee: number;

  @Prop()
  driver_notes: string;

  @Prop()
  customer_notes: string;

  @Prop()
  assigned_at: Date;

  @Prop()
  picked_up_at: Date;

  @Prop()
  delivered_at: Date;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
