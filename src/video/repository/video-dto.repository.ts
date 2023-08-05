import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { VideoSchema } from '../schema';
import { VideoDto } from '../dto/video.dto';

@Injectable()
export class VideoDtoRepository {
  constructor(
    @InjectModel(VideoSchema.name)
    private readonly videoModel: Model<VideoSchema>,
  ) {}

  async findVideos(): Promise<VideoDto[]> {
    return await this.videoModel
      .find({}, {}, { lean: true })
      .select('-videoUrl');
  }
}
