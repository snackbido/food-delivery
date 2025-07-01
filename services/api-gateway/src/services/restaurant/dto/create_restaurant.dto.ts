import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsObject()
  opening_hours?: {
    [key: string]: {
      open: string;
      close: string;
      is_closed: boolean;
    };
  };

  @IsOptional()
  @IsNumber()
  delivery_fee?: number;

  @IsOptional()
  @IsNumber()
  estimated_delivery_time?: number;
}
