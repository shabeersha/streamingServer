import { Injectable } from '@nestjs/common';
import { EntitySchemaFactory } from 'src/database';
import { ObjectId } from 'mongodb';
import { VideoSchema } from '.';
import { Video } from '../domain';

@Injectable()
export class VideoSchemaFactory
  implements EntitySchemaFactory<VideoSchema, Video>
{
  create(video: Video): VideoSchema {
    return {
      _id: new ObjectId(video.getId()),
      videoKey: video.getVideoKey(),
      videoUrl: video.getVideoUrl(),
      videoThumbnail: video.getVideoThumbnail(),
      description: video.getDescription(),
    };
  }
  createFromSchema(videoSchema: VideoSchema): Video {
    return new Video(
      videoSchema._id.toHexString(),
      videoSchema.videoKey,
      videoSchema.videoUrl,
      videoSchema.videoThumbnail,
      videoSchema.description,
    );
  }
}
