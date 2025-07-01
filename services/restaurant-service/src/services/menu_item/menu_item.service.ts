import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuItemDto } from '@restaurant/dto/create_menu_item.dto';
import { UpdateMenuItemDto } from '@restaurant/dto/update_menu_item.dto';
import { MenuItem } from '@restaurant/entity/menu_item.entity';
import { MenuItemRepository } from '@restaurant/repository/menu_item.repository';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItemRepository)
    private menuItemsRepository: MenuItemRepository,
  ) {}

  async findOne(id: string): Promise<MenuItem> {
    const menu_item = await this.menuItemsRepository.findOne({ where: { id } });

    if (!menu_item) throw new RpcException('Not found MenuItem');

    return menu_item;
  }

  async findByCategoryId(categoryId: string): Promise<MenuItem> {
    const menu_item = await this.menuItemsRepository.findOne({
      where: { category_id: categoryId },
    });

    if (!menu_item)
      throw new RpcException('Category or MenuItem does not exists');
    return menu_item;
  }

  async findAll(): Promise<MenuItem[]> {
    return await this.menuItemsRepository.find();
  }

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    const menu_item = this.menuItemsRepository.create(createMenuItemDto);

    await this.menuItemsRepository.save(menu_item);

    return menu_item;
  }

  async update(
    id: string,
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<string> {
    const menu_item = await this.findOne(id);
    Object.assign(menu_item, updateMenuItemDto);
    await this.menuItemsRepository.save(menu_item);

    return 'MenuItem has been updated';
  }

  async delete(id: string): Promise<string> {
    const menu_item = await this.findOne(id);

    menu_item.is_available = false;
    await this.menuItemsRepository.save(menu_item);

    return 'MenuItem has been deleted';
  }
}
