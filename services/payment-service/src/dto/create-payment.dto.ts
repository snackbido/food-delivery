import { PaymentMethod } from '@payment/entity/payment.entity';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDTO {
  @IsUUID()
  user_id: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsOptional()
  @IsString()
  payment_gateway?: string;
}
