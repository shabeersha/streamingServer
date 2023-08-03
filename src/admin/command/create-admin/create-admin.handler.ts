import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAdminCommand } from './create-admin.command';
import { AdminFactory } from '../../../admin/domain';
import { AdminEntity } from '../../../admin/entity';

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
  constructor(private readonly adminFactory: AdminFactory) {}

  async execute(command: CreateAdminCommand): Promise<AdminEntity> {
    const admin = await this.adminFactory.create(
      command.dto.username,
      command.dto.name,
      command.dto.password,
    );

    return new AdminEntity(admin);
  }
}
