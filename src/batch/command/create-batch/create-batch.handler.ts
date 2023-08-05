import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBatchCommand } from './create-batch.command';
import { BatchFactory } from '../../../batch/domain';
import { BatchEntity } from '../../../batch/entity';

@CommandHandler(CreateBatchCommand)
export class CreateBatchHandler implements ICommandHandler<CreateBatchCommand> {
  constructor(private readonly batchFactory: BatchFactory) {}

  async execute(command: CreateBatchCommand): Promise<BatchEntity> {
    const batch = await this.batchFactory.create(
      command.dto.branchCode,
      command.dto.batchNumber,
      command.videos,
      command.dto.password,
    );

    return new BatchEntity(batch);
  }
}
