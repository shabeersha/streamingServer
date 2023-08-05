import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityFactory } from '../../database';
import { ObjectId } from 'mongodb';
import { Video } from './video';
import { VideoEntityRepository } from '../repository';

@Injectable()
export class VideoFactory implements EntityFactory<Video> {
  constructor(private readonly videoEntityRepository: VideoEntityRepository) {}

  async create(
    videoKey: number,
    videoUrl: string,
    videoThumbnail: string,
    description: string,
  ): Promise<Video> {
    try {
      const video = new Video(
        new ObjectId().toHexString(),
        videoKey,
        videoUrl,
        videoThumbnail,
        description,
      );

      await this.videoEntityRepository.create(video);
      return video;
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('videokey already in use');
      }

      throw error;
    }
  }
}
