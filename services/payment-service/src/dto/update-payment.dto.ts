import { PaymentStatus } from '@payment/entity/payment.entity';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsUUID()
  order_id: string;

  @IsOptional()
  @IsUUID()
  user_id: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transaction_id?: string;

  @IsOptional()
  @IsString()
  failure_reason?: string;
}
