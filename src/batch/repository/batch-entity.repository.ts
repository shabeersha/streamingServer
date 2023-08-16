import { Injectable } from '@nestjs/common';
import { BatchSchema, BatchSchemaFactory } from '../schema';
import { BaseEntityRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Batch } from '../domain';

@Injectable()
export class BatchEntityRepository extends BaseEntityRepository<
  BatchSchema,
  Batch
> {
  constructor(
    @InjectModel(BatchSchema.name)
    readonly batchModel: Model<BatchSchema>,
    readonly batchSchemaFactory: BatchSchemaFactory,
  ) {
    super(batchModel, batchSchemaFactory);
  }
}
