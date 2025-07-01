import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from '@gateway/services/restaurant/dto/create_menu_item.dto';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
