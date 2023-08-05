import { CreateBatchDto } from '../../../batch/dto';
import { VideoDto } from '../../../video/dto';

export class CreateBatchCommand {
  constructor(
    public readonly dto: CreateBatchDto,
    public readonly videos: VideoDto[],
  ) {}
}
