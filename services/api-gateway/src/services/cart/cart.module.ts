import { Module } from '@nestjs/common';
import { CartController } from '@gateway/services/cart/cart.controller';
import { CartService } from '@gateway/services/cart/cart.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'CART_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('CART_SERVICE_HOST'),
            port: configService.get<number>('CART_SERVICE_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
