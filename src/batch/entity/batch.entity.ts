import { Exclude, Expose, Transform } from 'class-transformer';
import { VideoDto } from '../../video/dto';

export class BatchEntity {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  public readonly _id: string;

  public readonly branchCode: string;
  public readonly batchNumber: number;

  @Expose()
  @Transform((params) =>
    params.obj.videos.map((video) => ({
      ...video,
      _id: video._id.toString(),
    })),
  )
  public readonly videos: VideoDto[];

  @Exclude()
  public password: string;

  constructor(partial: Partial<BatchEntity>) {
    Object.assign(this, partial);
  }
}
