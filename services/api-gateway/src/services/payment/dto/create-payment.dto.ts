import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank',
}

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
