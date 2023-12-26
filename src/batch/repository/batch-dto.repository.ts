import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BatchSchema } from '../schema';
import { FilterQuery, Model } from 'mongoose';
import { BatchDto } from '../dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class BatchDtoRepository {
  constructor(
    @InjectModel(BatchSchema.name)
    private readonly batchModel: Model<BatchSchema>,
  ) {}

  async findOne(branchCode: string, batchNumber: number): Promise<BatchDto> {
    const batch = await this.batchModel.findOne(
      { branchCode, batchNumber } as FilterQuery<BatchSchema>,
      {},
      { lean: true },
    );
  
   
  
    const batchDto: BatchDto = {
      ...batch,
      _id: batch._id.toString(), 
    };
  
    return batchDto;
  }

 
  async findOneById(batchId: string): Promise<BatchDto> {
    const batch = await this.batchModel.findOne(
      { _id: new ObjectId(batchId) } as FilterQuery<BatchSchema>,
      {},
      { lean: true },
    );
  
  
    const batchDto: BatchDto = {
      ...batch,
      _id: batch._id.toString(), 
    };
  
    return batchDto;
  }
}
