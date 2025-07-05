import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/common';

@Entity({ name: 'accounts' })
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'nvarchar', length: 1024 })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'full_name' })
  fullName: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
