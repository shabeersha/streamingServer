import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVideosQuery } from './get-videos.query';
import { VideoDtoRepository } from '../../../video/repository';
import { VideoDto } from 'src/video/dto/video.dto';

@QueryHandler(GetVideosQuery)
export class GetVideosHandler implements IQueryHandler<GetVideosQuery> {
  constructor(private readonly videoDtoRepository: VideoDtoRepository) {}

  async execute(query: GetVideosQuery): Promise<VideoDto[]> {
    return await this.videoDtoRepository.findVideos();
  }
}
