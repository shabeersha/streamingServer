import { Injectable } from '@nestjs/common';
import { EntitySchemaFactory } from '@app/common';
import { ObjectId } from 'mongodb';
import { BatchSchema } from '.';
import { Batch } from '../domain';

@Injectable()
export class BatchSchemaFactory
  implements EntitySchemaFactory<BatchSchema, Batch>
{
  create(batch: Batch): BatchSchema {
    return {
      _id: new ObjectId(batch.getId()),
      branchCode: batch.getBranchCode(),
      batchNumber: batch.getBatchNumber(),
      videos: batch.getVideos(),
      password: batch.getPassword(),
    };
  }
  createFromSchema(batchSchema: BatchSchema): Batch {
    return new Batch(
      batchSchema._id.toHexString(),
      batchSchema.branchCode,
      batchSchema.batchNumber,
      batchSchema.videos,
      batchSchema.password,
    );
  }
}
