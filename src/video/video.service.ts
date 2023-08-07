import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateVideoCommand,
  DeleteVideoCommand,
  EditVideoCommand,
} from './command';
import { Video } from './domain';
import { CreateVideoDto, EditVideoDto, ManageVideoDto, VideoDto } from './dto';
import { FindVideoQuery } from './query';
import { FindBatchQuery } from '../batch/query';
import { BatchDto } from '../batch/dto';
import { EditBatchCommand } from '../batch/command';
import { BatchEntity } from '../batch/entity';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly socketService: SocketService,
  ) {}

  public async createVideo(dto: CreateVideoDto): Promise<Video> {
    return await this.commandBus.execute<CreateVideoCommand, Video>(
      new CreateVideoCommand(dto),
    );
  }

  public async editVideo(videoId: string, dto: EditVideoDto): Promise<Video> {
    return await this.commandBus.execute<EditVideoCommand, Video>(
      new EditVideoCommand(videoId, dto),
    );
  }

  public async deleteVideo(videoId: string): Promise<void> {
    return await this.commandBus.execute<DeleteVideoCommand>(
      new DeleteVideoCommand(videoId),
    );
  }

  public async unlockVideo(dto: ManageVideoDto): Promise<BatchEntity> {
    const { videoUrl } = await this.queryBus.execute<FindVideoQuery, VideoDto>(
      new FindVideoQuery(dto.videoId),
    );

    const batch = await this.queryBus.execute<FindBatchQuery, BatchDto>(
      new FindBatchQuery(dto.batchId),
    );

    const videos: VideoDto[] = batch.videos.map((video) => {
      if (video._id.toString() === dto.videoId) {
        video.videoUrl = videoUrl;
        return video;
      }

      return video;
    });

    const batchEntity = await this.commandBus.execute<
      EditBatchCommand,
      BatchEntity
    >(new EditBatchCommand(dto.batchId, undefined, videos));

    this.socketService.handleEmitBatch(dto.batchId, batchEntity);

    return batchEntity;
  }

  public async lockVideo(dto: ManageVideoDto): Promise<BatchEntity> {
    const batch = await this.queryBus.execute<FindBatchQuery, BatchDto>(
      new FindBatchQuery(dto.batchId),
    );

    const videos: VideoDto[] = batch.videos.map((video) => {
      if (video._id.toString() === dto.videoId) {
        delete video.videoUrl;
        return video;
      }

      return video;
    });

    const batchEntity = await this.commandBus.execute<
      EditBatchCommand,
      BatchEntity
    >(new EditBatchCommand(dto.batchId, undefined, videos));

    this.socketService.handleEmitBatch(dto.batchId, batchEntity);

    return batchEntity;
  }
}
