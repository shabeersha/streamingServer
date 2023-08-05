import { EditBatchDto } from 'src/batch/dto/edit-batch.dto';
import { Batch } from '../../../batch/domain';
import { VideoDto } from '../../../video/dto';

export class UpdateBatchCommand {
  constructor(
    public readonly batch: Batch,
    public readonly videos: VideoDto[],
  ) {}
}
