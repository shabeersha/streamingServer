import { CreateAdminDto } from '../../../admin/dto';

export class CreateAdminCommand {
  constructor(public readonly dto: CreateAdminDto) {}
}
