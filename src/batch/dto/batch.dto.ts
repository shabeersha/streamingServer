import { VideoDto } from '../..//video/dto';

export class BatchDto {
  _id: string;
  branchCode: string;
  batchNumber: number;
  videos: VideoDto[];
  password: string;
}
