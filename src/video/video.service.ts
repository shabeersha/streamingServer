import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateVideoCommand,
  DeleteVideoCommand,
  EditVideoCommand,
} from './command';
import { Video } from './domain';
import { CreateVideoDto, EditVideoDto } from './dto';

@Injectable()
export class VideoService {
  constructor(private readonly commandBus: CommandBus) {}

  public async createVideo(dto: CreateVideoDto): Promise<Video> {
    return await this.commandBus.execute<CreateVideoCommand, Video>(
      new CreateVideoCommand(dto),
    );
  }

  public async editVideo(videoId: string, dto: EditVideoDto): Promise<Video> {
    return this.commandBus.execute<EditVideoCommand, Video>(
      new EditVideoCommand(videoId, dto),
    );
  }

  public async deleteVideo(videoId: string): Promise<void> {
    return this.commandBus.execute<DeleteVideoCommand>(
      new DeleteVideoCommand(videoId),
    );
  }
}
