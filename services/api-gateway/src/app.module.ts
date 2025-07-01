import { Module } from '@nestjs/common';
import { AuthModule } from '@gateway/services/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@gateway/services/user/user.module';
import { RestaurantModule } from '@gateway/services/restaurant/restaurant.module';
import { OrderModule } from '@gateway/services/order/order.module';
import { PaymentModule } from '@gateway/services/payment/payment.module';
import { CartModule } from '@gateway/services/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    AuthModule,
    UserModule,
    RestaurantModule,
    OrderModule,
    PaymentModule,
    CartModule,
  ],
})
export class AppModule {}
