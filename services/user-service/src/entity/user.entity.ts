import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Roles {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  DELIVERY = 'delivery',
  OWN_RESTAURANT = 'owner',
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
export class User {
  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true })
  full_name: string;

  @Prop()
  phone_number: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: [] })
  favorite_restaurant: string[];

  @Prop({
    type: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  })
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };

  @Prop({ enum: Roles, default: Roles.CUSTOMER })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
