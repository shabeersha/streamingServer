import { Injectable } from '@nestjs/common';
import { BaseEntityRepository } from '../../database';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoSchema, VideoSchemaFactory } from '../schema';
import { Video } from '../domain';

@Injectable()
export class VideoEntityRepository extends BaseEntityRepository<
  VideoSchema,
  Video
> {
  constructor(
    @InjectModel(VideoSchema.name)
    readonly videoModel: Model<VideoSchema>,
    readonly videoSchemaFactory: VideoSchemaFactory,
  ) {
    super(videoModel, videoSchemaFactory);
  }
}
