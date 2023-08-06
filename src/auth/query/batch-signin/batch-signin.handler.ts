import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { verify } from 'argon2';
import { BatchSigninQuery } from './batch-signin.query';
import { BatchDtoRepository } from '../../../batch/repository';
import { BatchDto } from '../../../batch/dto';

@QueryHandler(BatchSigninQuery)
export class BatchSigninHandler implements IQueryHandler<BatchSigninQuery> {
  constructor(private readonly batchDtoRepository: BatchDtoRepository) {}

  async execute(query: BatchSigninQuery): Promise<BatchDto> {
    const batch = await this.batchDtoRepository.findOne(
      query.dto.branchCode,
      query.dto.batchNumber,
    );

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    const passwordMatch = await verify(batch.password, query.dto.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return batch;
  }
}
