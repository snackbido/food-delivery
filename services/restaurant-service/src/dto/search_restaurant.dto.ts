import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchRestaurantDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  radius?: number; // km

  @IsOptional()
  @IsNumber()
  min_rating?: number;

  @IsOptional()
  @IsBoolean()
  is_open?: boolean;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}
