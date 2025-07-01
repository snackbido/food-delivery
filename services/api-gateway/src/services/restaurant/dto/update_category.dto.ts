import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from '@gateway/services/restaurant/dto/create_category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
