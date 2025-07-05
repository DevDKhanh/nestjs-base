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
import { JwtAuthGuard } from '../../guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get('/profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    return this.accountsService.findById(req.user.id);
  }
}
