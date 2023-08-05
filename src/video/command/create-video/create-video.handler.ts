import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVideoCommand } from './create-video.command';
import { Video, VideoFactory } from '../../../video/domain';

@CommandHandler(CreateVideoCommand)
export class CreateVideoHandler implements ICommandHandler<CreateVideoCommand> {
  constructor(private readonly videoFactory: VideoFactory) {}

  async execute(command: CreateVideoCommand): Promise<Video> {
    const video = await this.videoFactory.create(
      command.dto.videoKey,
      command.dto.videoUrl,
      command.dto.videoThumbnail,
      command.dto.description,
    );

    return video;
  }
}
