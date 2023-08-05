import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateVideoCommand } from './command';
import { Video } from './domain';
import { CreateVideoDto } from './dto';

@Injectable()
export class VideoService {
  constructor(private readonly commandBus: CommandBus) {}

  public async createVideo(dto: CreateVideoDto) {
    return await this.commandBus.execute<CreateVideoCommand, Video>(
      new CreateVideoCommand(dto),
    );
  }
}
