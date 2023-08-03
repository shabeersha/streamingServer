import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAdminDto } from './dto';
import { AdminService } from './admin.service';
import { AdminEntity } from './entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  createAdmin(@Body() dto: CreateAdminDto): Promise<AdminEntity> {
    return this.adminService.createAdmin(dto);
  }
}
