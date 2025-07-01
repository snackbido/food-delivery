import { Module } from '@nestjs/common';
import { MenuItemService } from '@restaurant/services/menu_item/menu_item.service';
import { MenuItemRepository } from '@restaurant/repository/menu_item.repository';
import { MenuItemController } from '@restaurant/services/menu_item/menu_item.controller';

@Module({
  providers: [MenuItemService, MenuItemRepository],
  controllers: [MenuItemController],
})
export class MenuItemModule {}
