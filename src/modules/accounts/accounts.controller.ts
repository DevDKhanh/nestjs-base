import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RequireUser } from 'src/decorators/require-user.decorator';
import { Jwt } from 'src/decorators/jwt.decorator';
import { JwtData } from 'src/common';

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
