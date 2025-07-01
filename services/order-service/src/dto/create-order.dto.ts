import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from '@order/dto/order-item.dto';
import { Location } from '@order/dto/location.dto';

export class CreateOrderDTO {
  @IsString()
  user_id: string;

  @IsString()
  restaurant_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  delivery_fee: number;

  @IsObject()
  @Type(() => Location)
  delivery_address: Location;

  @IsString()
  payment_method: string;

  @IsString()
  @IsOptional()
  payment_gateway: string;
}
