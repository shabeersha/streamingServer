import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAdminDto } from './dto';
import { CreateAdminCommand } from './command';
import { Admin } from './domain';
import { AdminEntity } from './entity';

@Injectable()
export class AdminService {
  constructor(private readonly commandBus: CommandBus) {}

  createAdmin(dto: CreateAdminDto): Promise<AdminEntity> {
    return this.commandBus.execute<CreateAdminCommand, Admin>(
      new CreateAdminCommand(dto),
    );
  }
}
