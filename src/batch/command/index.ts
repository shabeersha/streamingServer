import { CreateBatchHandler } from './create-batch/create-batch.handler';
import { UpdateBatchHandler } from './update-batch/update-batch.handler';

export const BatchCommandHandlers = [CreateBatchHandler, UpdateBatchHandler];

export * from './create-batch/create-batch.command';
export * from './update-batch/update-batch.command';
