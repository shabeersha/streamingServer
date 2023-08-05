import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { CqrsModule } from '@nestjs/cqrs';
import { VideoCommandHandlers } from './command';
import { VideoFactory } from './domain';
import { VideoDtoRepository, VideoEntityRepository } from './repository';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { VideoSchema, VideoSchemaFactory } from './schema';
import { VideoQueryHandlers } from './query';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: VideoSchema.name,
        schema: SchemaFactory.createForClass(VideoSchema),
      },
    ]),
  ],
  controllers: [VideoController],
  providers: [
    VideoService,
    VideoEntityRepository,
    VideoDtoRepository,
    VideoSchemaFactory,
    VideoFactory,
    ...VideoCommandHandlers,
    ...VideoQueryHandlers,
  ],
})
export class VideoModule {}
