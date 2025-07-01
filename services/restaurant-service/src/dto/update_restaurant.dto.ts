import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from '@restaurant/dto/create_restaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
