import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetReviewsDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  restaurant_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  user_id?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @ApiProperty()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiProperty()
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty()
  rating?: number;
}
