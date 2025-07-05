import {
  Controller,
  Get,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
