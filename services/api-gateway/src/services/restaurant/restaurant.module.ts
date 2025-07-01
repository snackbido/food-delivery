import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'RESTAURANT_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('RESTAURANT_SERVICE_HOST'),
            port: configService.get<number>('RESTAURANT_SERVICE_PORT'),
          },
        }),
      },
    ]),
  ],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
