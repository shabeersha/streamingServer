import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { CqrsModule } from '@nestjs/cqrs';
import { videoHandlers } from './command';
import { VideoFactory } from './domain';
import { VideoEntityRepository } from './repository';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { VideoSchema, VideoSchemaFactory } from './schema';

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
    VideoSchemaFactory,
    VideoFactory,
    ...videoHandlers,
  ],
})
export class VideoModule {}
