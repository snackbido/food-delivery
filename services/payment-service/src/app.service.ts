import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentRepository } from '@payment/repository/payment.repository';
import { Producer } from '@payment/shared/queue/producer.service';
import { RpcException } from '@nestjs/microservices';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(PaymentRepository)
    private paymentRepository: PaymentRepository,

    private producer: Producer,
  ) {}

  async findAll(): Promise<Payment[]> {
    const payments = await this.paymentRepository.find();

    return payments;
  }

  async findPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new RpcException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async processPayment(paymentId: string, status: string): Promise<Payment> {
    const payment = await this.findPaymentById(paymentId);
    const channel = await this.producer.connect();
    let paymentSaved;
    if (payment.status !== PaymentStatus.PENDING) {
      throw new Error('Payment is not in pending status');
    }
    // Update status to processing
    payment.status = PaymentStatus.PROCESSING;
    paymentSaved = await this.paymentRepository.save(payment);
    if (payment.payment_method !== 'cash') {
      if (status === 'success') {
        payment.status = PaymentStatus.COMPLETED;
        paymentSaved = await this.paymentRepository.save(payment);
        await this.producer.publishExchangeMessage(
          channel,
          'payment-order-created',
          'payment-order',
          JSON.stringify({
            type: 'payment-order-created',
            data: paymentSaved,
          }),
          'direct',
        );
        await this.producer.publishExchangeMessage(
          channel,
          'payment-notification-created',
          'payment-notification',
          JSON.stringify({
            type: 'payment-notification-created',
            title: 'Thanh toán thành công',
            message: `Bạn đã thanh toán đơn hàng ${payment.order_id} thành công`,
            user_id: payment.user_id,
          }),
          'direct',
        );
      }
    } else {
      payment.status = PaymentStatus.FAILED;
      payment.failure_reason = 'Payment gateway error';
      paymentSaved = await this.paymentRepository.save(payment);

      await this.producer.publishExchangeMessage(
        channel,
        'payment-notification-failed',
        'payment-notification',
        JSON.stringify({
          type: 'payment-notification-failed',
          title: 'Thanh toán thất bại',
          message: `Đơn hàng ${paymentSaved.order_id} chưa được thanh toán`,
          user_id: paymentSaved.user_id,
        }),
        'direct',
      );
    }

    return paymentSaved;
  }

  async refundPayment(paymentId: string): Promise<Payment> {
    const payment = await this.findPaymentById(paymentId);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new Error('Can only refund completed payments');
    }

    payment.status = PaymentStatus.REFUNDED;
    const refundedPayment = await this.paymentRepository.save(payment);

    // Publish payment refunded event
    const channel = await this.producer.connect();
    await this.producer.publishExchangeMessage(
      channel,
      'payment-refunded',
      'payment',
      JSON.stringify({
        type: 'refund-payment-order',
        paymentId: payment.id,
        orderId: payment.order_id,
        userId: payment.user_id,
        amount: payment.amount,
        transactionId: payment.transaction_id,
      }),
      'direct',
    );

    return refundedPayment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<string> {
    const payment = await this.findPaymentById(id);

    await this.paymentRepository.update(payment.id, updatePaymentDto);

    return 'Payment has been updated';
  }
}
