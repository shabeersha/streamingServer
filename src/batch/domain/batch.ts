import { AggregateRoot } from '@nestjs/cqrs';
import { VideoDto } from '../../video/dto';
import { EditBatchDto } from '../dto/edit-batch.dto';
import * as argon from 'argon2';

export class Batch extends AggregateRoot {
  constructor(
    public readonly _id: string,
    public branchCode: string,
    public batchNumber: number,
    public videos: VideoDto[],
    public password: string,
  ) {
    super();
  }

  getId(): string {
    return this._id;
  }

  getBranchCode(): string {
    return this.branchCode;
  }

  getBatchNumber(): number {
    return this.batchNumber;
  }

  getVideos(): VideoDto[] {
    return this.videos;
  }

  getPassword(): string {
    return this.password;
  }

  async updateBatch(dto: EditBatchDto, videos?: VideoDto[]): Promise<void> {
    if (dto.password) {
      this.password = await argon.hash(dto.password);
    }

    this.branchCode = dto.branchCode ? dto.branchCode : this.branchCode;
    this.batchNumber = dto.batchNumber ? dto.batchNumber : this.batchNumber;
    this.videos = videos ? videos : this.videos;
  }
}
