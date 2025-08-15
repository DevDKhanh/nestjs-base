import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common';
import { Account } from 'src/modules/accounts/entities/account.entity';

@Entity({ name: 'refesh_token' })
export class RefeshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  @OneToOne(() => Account, (account) => account.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account;

  @Column({ type: 'varchar', length: 2048 })
  token: string;

  @Column({ type: 'nvarchar', length: 1024, name: 'device_id', nullable: true })
  deviceId: string;
}
