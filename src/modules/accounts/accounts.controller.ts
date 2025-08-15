import { Controller, Get, Post, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtData } from 'src/common';
import { Jwt } from 'src/core/decorators/jwt.decorator';
import { RequireUser } from 'src/core/decorators/require-user.decorator';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get('/profile')
  @ApiBearerAuth()
  @RequireUser()
  findAll(@Jwt() jwt: JwtData) {
    return this.accountsService.findById(jwt.id);
  }
}
