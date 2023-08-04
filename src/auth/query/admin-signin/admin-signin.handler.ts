import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { AdminSigninQuery } from './admin-signin.query';
import { AdminDtoRepository } from '../../../admin/repository';
import { AdminDto } from '../../../admin/dto';

@QueryHandler(AdminSigninQuery)
export class AdminSigninHandler implements IQueryHandler<AdminSigninQuery> {
  constructor(private readonly adminDtoRepository: AdminDtoRepository) {}

  async execute(query: AdminSigninQuery): Promise<AdminDto> {
    const admin = await this.adminDtoRepository.findByUsername(
      query.dto.username,
    );

    const passwordMatch = await verify(admin.password, query.dto.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return admin;
  }
}
