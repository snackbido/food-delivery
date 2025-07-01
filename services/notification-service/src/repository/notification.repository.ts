import { Injectable } from '@nestjs/common';
import { Notification } from '@notification/entity/notification.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }
}
