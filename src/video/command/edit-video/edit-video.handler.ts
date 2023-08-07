import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditVideoCommand } from './edit-video.command';
import { VideoEntityRepository } from '../../../video/repository';
import { Video } from '../../../video/domain';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(EditVideoCommand)
export class EditVideoHandler implements ICommandHandler<EditVideoCommand> {
  constructor(private readonly videoEntityRepository: VideoEntityRepository) {}

  public async execute(command: EditVideoCommand): Promise<Video> {
    const video = await this.videoEntityRepository.findOneById(command.videoId);

    if (!video) throw new NotFoundException('Video not found');

    video.editVideo(command.dto);

    await this.videoEntityRepository.findOneAndUpdateById(
      command.videoId,
      video,
    );
    return video;
  }
}
