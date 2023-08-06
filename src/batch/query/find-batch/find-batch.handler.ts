import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindBatchQuery } from './find-batch.query';
import { BatchDtoRepository } from '../../../batch/repository';
import { BatchDto } from '../../../batch/dto';

@QueryHandler(FindBatchQuery)
export class FindBatchHandler implements IQueryHandler<FindBatchQuery> {
  constructor(private readonly batchDtoRepository: BatchDtoRepository) {}

  async execute(query: FindBatchQuery): Promise<BatchDto> {
    return await this.batchDtoRepository.findOneById(query.batchId);
  }
}
