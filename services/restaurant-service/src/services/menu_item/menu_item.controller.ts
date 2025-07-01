import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateMenuItemDto } from '@restaurant/dto/create_menu_item.dto';
import { MenuItem } from '@restaurant/entity/menu_item.entity';
import { MenuItemService } from '@restaurant/services/menu_item/menu_item.service';

@Controller()
export class MenuItemController {
  constructor(private menuItemService: MenuItemService) {}

  @MessagePattern('findOneMenuItem')
  async findOne(@Payload() id: string): Promise<MenuItem> {
    try {
      return await this.menuItemService.findOne(id);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('findMenuItemByCategoryId')
  async findByCategoryId(@Payload() id: string): Promise<MenuItem> {
    try {
      return await this.menuItemService.findByCategoryId(id);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('findAllMenuItem')
  async findAll(): Promise<MenuItem[]> {
    try {
      return await this.menuItemService.findAll();
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('createMenuItem')
  async create(
    @Payload() createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    try {
      return await this.menuItemService.create(createMenuItemDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('updateMenuItem')
  async update(@Payload() data: any): Promise<string> {
    try {
      const { id, updateMenuItemDto } = data;
      return await this.menuItemService.update(id, updateMenuItemDto);
    } catch (error) {
      return error;
    }
  }

  @MessagePattern('deleteMenuItem')
  async delete(@Payload() id: string): Promise<string> {
    try {
      return await this.menuItemService.delete(id);
    } catch (error) {
      return error;
    }
  }
}
