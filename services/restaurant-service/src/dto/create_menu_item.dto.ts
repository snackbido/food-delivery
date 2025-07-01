import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsBoolean()
  is_available: boolean;

  @IsNumber()
  preparation_time: number;

  @IsString()
  restaurant_id: string;

  @IsString()
  category_id: string;
}
