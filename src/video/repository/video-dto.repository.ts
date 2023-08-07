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

  async findVideoById(videoId: string): Promise<VideoDto> {
    const video: VideoDto = await this.videoModel.findById(
      new ObjectId(videoId),
    );

    if (!video) throw new NotFoundException('Video not found');

    return video;
  }
}
