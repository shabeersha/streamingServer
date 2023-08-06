import { EditBatchDto } from '../../../batch/dto';
import { VideoDto } from '../../../video/dto';

export class EditBatchCommand {
  constructor(
    public readonly batchId: string,
    public readonly dto?: EditBatchDto,
    public readonly videos?: VideoDto[],
  ) {}
}
