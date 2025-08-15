import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
  private logger = new Logger(AccountsService.name);
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async validateAccount(username: string, password: string) {
    const account = await this.accountRepository.findOne({
      where: { username },
    });

    if (
      (account && !bcrypt.compareSync(password, account.password)) ||
      !account
    ) {
      return false;
    }

    return {
      id: account.id,
      username: account.username,
      fullName: account.fullName,
    };
  }

  async create(createAccountDto: CreateAccountDto) {
    const checkExist = await this.accountRepository.findOne({
      where: { username: createAccountDto.username },
    });
    if (checkExist) {
      return 'Tài khoản đã tồn tại';
    }

    const account = this.accountRepository.create(createAccountDto);
    await this.accountRepository.save(account);
    return {
      id: account.id,
      username: account.username,
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
    };
  }

  async findById(id: number) {
    const account = await this.accountRepository.findOne({
      where: { id },
      select: ['id', 'username', 'fullName', 'email', 'phone'],
    });
    return account;
  }

  async findAll() {
    const accounts = await this.accountRepository.find();
    return accounts.map((account) => {
      return {
        id: account.id,
        username: account.username,
        fullName: account.fullName,
        email: account.email,
        phone: account.phone,
      };
    });
  }
}
