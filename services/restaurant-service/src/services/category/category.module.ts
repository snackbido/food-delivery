import { Module } from '@nestjs/common';
import { CategoryService } from '@restaurant/services/category/category.service';
import { CategoryController } from '@restaurant/services/category/category.controller';
import { CategoryRepository } from '@restaurant/repository/category.repository';

@Module({
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
