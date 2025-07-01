import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from '@restaurant/dto/create_category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
