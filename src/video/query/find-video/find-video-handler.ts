import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindVideoQuery } from './find-video.query';
import { VideoDtoRepository } from '../../../video/repository';
import { VideoDto } from '../../../video/dto';

@QueryHandler(FindVideoQuery)
export class FindVideoHandler implements IQueryHandler<FindVideoQuery> {
  constructor(private readonly videoDtoRepository: VideoDtoRepository) {}

  execute(query: FindVideoQuery): Promise<VideoDto> {
    return this.videoDtoRepository.findVideoById(query.videoId);
  }
}
