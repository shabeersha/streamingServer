import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BatchSchema } from '../schema';
import { FilterQuery, Model } from 'mongoose';
import { BatchDto } from '../dto';

@Injectable()
export class BatchDtoRepository {
  constructor(
    @InjectModel(BatchSchema.name)
    private readonly batchModel: Model<BatchSchema>,
  ) {}

  async findOne(branchCode: string, batchNumber: number): Promise<BatchDto> {
    return await this.batchModel.findOne(
      { branchCode, batchNumber } as FilterQuery<BatchSchema>,
      {},
      { lean: true },
    );
  }
}
