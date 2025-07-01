import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoryDto } from '@restaurant/dto/create_category.dto';
import { Category } from '@restaurant/entity/category.entity';
import { CategoryService } from '@restaurant/services/category/category.service';

@Controller()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @MessagePattern('findOneCategory')
  async findOne(@Payload() id: string): Promise<Category> {
    try {
      return await this.categoryService.findOne(id);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('findAllCategory')
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryService.findAll();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @MessagePattern('createCategory')
  async create(
    @Payload() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('updateCategory')
  async update(@Payload() data: any): Promise<string> {
    try {
      const { id, updateCategoryDto } = data;
      return await this.categoryService.update(id, updateCategoryDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('deleteCategory')
  async delete(@Payload() id: string): Promise<string> {
    try {
      return await this.categoryService.delete(id);
    } catch (error) {
      return error;
    }
  }
}
