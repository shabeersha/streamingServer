import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BatchEntity } from '../../../batch/entity';
import { UpdateBatchCommand } from './update-batch.command';
import { BatchEntityRepository } from '../../../batch/repository';

@CommandHandler(UpdateBatchCommand)
export class UpdateBatchHandler implements ICommandHandler<UpdateBatchCommand> {
  constructor(private readonly batchEntityRepository: BatchEntityRepository) {}

  async execute(command: UpdateBatchCommand): Promise<BatchEntity> {
    await this.batchEntityRepository.findOneAndUpdateById(
      command.batch._id,
      command.batch,
    );

    return new BatchEntity(command.batch);
  }
}
