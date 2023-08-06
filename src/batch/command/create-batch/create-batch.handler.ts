import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBatchCommand } from './create-batch.command';
import { BatchFactory } from '../../../batch/domain';
import { BatchEntity } from '../../../batch/entity';
import { BatchEntityRepository } from '../../../batch/repository';
import { FilterQuery } from 'mongoose';
import { BatchSchema } from '../../../batch/schema';

@CommandHandler(CreateBatchCommand)
export class CreateBatchHandler implements ICommandHandler<CreateBatchCommand> {
  constructor(
    private readonly batchEntityRepository: BatchEntityRepository,
    private readonly batchFactory: BatchFactory,
  ) {}

  async execute(command: CreateBatchCommand): Promise<BatchEntity> {
    const batch = await this.batchEntityRepository.findOne({
      branchCode: command.dto.branchCode,
      batchNumber: command.dto.batchNumber,
    } as FilterQuery<BatchSchema>);

    if (batch) {
      await batch.updateBatch(
        { password: command.dto.password },
        command.videos,
      );

      await this.batchEntityRepository.findOneAndUpdateById(
        batch.getId(),
        batch,
      );

      return new BatchEntity(batch);
    }

    const newBatch = await this.batchFactory.create(
      command.dto.branchCode,
      command.dto.batchNumber,
      command.videos,
      command.dto.password,
    );

    return new BatchEntity(newBatch);
  }
}
