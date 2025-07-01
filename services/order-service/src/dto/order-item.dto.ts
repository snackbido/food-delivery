import { IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
  @IsString()
  item_id: string;

  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}
