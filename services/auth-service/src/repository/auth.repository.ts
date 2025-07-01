import { Auth } from '@auth/entity/auth.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(private dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }
}
