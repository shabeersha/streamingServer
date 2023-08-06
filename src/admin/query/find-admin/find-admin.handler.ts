import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAdminQuery } from './find-admin.query';
import { AdminDtoRepository } from '../../../admin/repository';
import { AdminDto } from '../../../admin/dto';

@QueryHandler(FindAdminQuery)
export class FindAdminHandler implements IQueryHandler<FindAdminQuery> {
  constructor(private readonly adminDtoRepository: AdminDtoRepository) {}

  async execute(query: FindAdminQuery): Promise<AdminDto> {
    return await this.adminDtoRepository.findById(query._id);
  }
}
