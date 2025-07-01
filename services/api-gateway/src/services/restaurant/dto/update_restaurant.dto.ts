import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from '@gateway/services/restaurant/dto/create_restaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
