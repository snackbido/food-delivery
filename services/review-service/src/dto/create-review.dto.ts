import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @ApiProperty()
  user_id: string;

  @IsUUID()
  @ApiProperty()
  restaurant_id: string;

  @IsUUID()
  @ApiProperty()
  order_id: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty()
  rating: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  images?: string[];
}
