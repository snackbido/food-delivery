import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from '@restaurant/dto/create_category.dto';
import { UpdateCategoryDto } from '@restaurant/dto/update_category.dto';
import { Category } from '@restaurant/entity/category.entity';
import { CategoryRepository } from '@restaurant/repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['menu_items'],
    });

    if (!category) throw new RpcException('Not found category');

    return category;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);

    await this.categoryRepository.save(category);

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<string> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    await this.categoryRepository.save(category);

    return 'Category has been updated';
  }

  async delete(id: string): Promise<string> {
    const category = await this.findOne(id);

    category.is_active = false;
    await this.categoryRepository.save(category);

    return 'Category has been deleted';
  }
}
