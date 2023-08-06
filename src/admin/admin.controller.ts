import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminDto, CreateAdminDto } from './dto';
import { AdminService } from './admin.service';
import { AdminEntity } from './entity';
import { AdminAccessGuard } from '../auth/guard';
import { SerializeUser } from '../auth/decorator';

@UseGuards(AdminAccessGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  createAdmin(@Body() dto: CreateAdminDto): Promise<AdminEntity> {
    return this.adminService.createAdmin(dto);
  }

  @Get()
  getAdmin(@SerializeUser() admin: AdminDto): AdminEntity {
    return new AdminEntity(admin);
  }
}
