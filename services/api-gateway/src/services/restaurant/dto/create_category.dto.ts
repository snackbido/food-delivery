import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  image: string;

  @IsBoolean()
  is_active: boolean;
}
