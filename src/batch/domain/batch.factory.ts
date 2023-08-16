import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import * as argon from 'argon2';
import { EntityFactory } from '@app/common';
import { Batch } from './batch';
import { BatchEntityRepository } from '../repository';
import { ObjectId } from 'mongodb';
import { VideoDto } from 'src/video/dto';

@Injectable()
export class BatchFactory implements EntityFactory<Batch> {
  constructor(
    @Inject(forwardRef(() => BatchEntityRepository))
    private readonly batchEntityRepository: BatchEntityRepository,
  ) {}

  async create(
    branchCode: string,
    batchNumber: number,
    videos: VideoDto[],
    password: string,
  ): Promise<Batch> {
    try {
      const hash = await argon.hash(password);
      const batch = new Batch(
        new ObjectId().toHexString(),
        branchCode,
        batchNumber,
        videos,
        hash,
      );

      await this.batchEntityRepository.create(batch);
      return batch;
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Batch number is already reserved');
      }

      throw error;
    }
  }
}
