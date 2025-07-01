import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MenuItem } from '@restaurant/entity/menu_item.entity';

@Injectable()
export class MenuItemRepository extends Repository<MenuItem> {
  constructor(private dataSource: DataSource) {
    super(MenuItem, dataSource.createEntityManager());
  }
}
