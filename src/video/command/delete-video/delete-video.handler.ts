import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteVideoCommand } from './delete-video.command';
import { VideoEntityRepository } from '../../../video/repository';

@CommandHandler(DeleteVideoCommand)
export class DeleteVideoHandler implements ICommandHandler<DeleteVideoCommand> {
  constructor(private readonly videoEntityRepository: VideoEntityRepository) {}

  async execute(command: DeleteVideoCommand): Promise<void> {
    return this.videoEntityRepository.findOneAndDeleteById(command.videoId);
  }
}
