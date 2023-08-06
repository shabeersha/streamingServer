import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BatchEntity } from '../../../batch/entity';
import { BatchEntityRepository } from '../../../batch/repository';
import { EditBatchCommand } from './edit-batch.command';

@CommandHandler(EditBatchCommand)
export class EditBatchHandler implements ICommandHandler<EditBatchCommand> {
  constructor(private readonly batchEntityRepository: BatchEntityRepository) {}

  async execute(command: EditBatchCommand): Promise<BatchEntity> {
    const batch = await this.batchEntityRepository.findOneById(command.batchId);

    await batch.updateBatch(
      command.dto ? command.dto : {},
      command.videos ? command.videos : null,
    );

    await this.batchEntityRepository.findOneAndUpdateById(batch.getId(), batch);

    return new BatchEntity(batch);
  }
}
