import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Roles {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  DELIVERY = 'delivery',
  OWN_RESTAURANT = 'owner',
}

@Entity({ name: 'auth' })
export class Auth {
  @Column()
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column()
  email: string;

  @Column()
  full_name: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.CUSTOMER })
  role: string;

  @Column()
  phone_number: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
