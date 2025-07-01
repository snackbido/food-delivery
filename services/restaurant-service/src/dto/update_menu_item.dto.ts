import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from '@restaurant/dto/create_menu_item.dto';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
