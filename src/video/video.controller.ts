import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateVideoDto } from './dto';
import { Video } from './domain';
import { VideoService } from './video.service';
import { AdminAccessGuard } from '../auth/guard';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(AdminAccessGuard)
  @Post()
  createVideo(@Body() dto: CreateVideoDto): Promise<Video> {
    return this.videoService.createVideo(dto);
  }
}
