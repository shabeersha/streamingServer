import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindBatchQuery } from './find-batch.query';
import { BatchDtoRepository } from '../../../batch/repository';
import { BatchDto } from 'src/batch/dto';

@QueryHandler(FindBatchQuery)
export class FindBatchHandler implements IQueryHandler<FindBatchQuery> {
  constructor(private readonly batchDtoRepository: BatchDtoRepository) {}

  async execute(query: FindBatchQuery): Promise<BatchDto> {
    return await this.batchDtoRepository.findOne(
      query.branchCode,
      query.batchNumber,
    );
  }
}
