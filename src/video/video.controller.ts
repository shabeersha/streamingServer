import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateVideoDto, EditVideoDto, ManageVideoDto } from './dto';
import { Video } from './domain';
import { VideoService } from './video.service';
import { AdminAccessGuard } from '../auth/guard';
import { BatchEntity } from 'src/batch/entity';

@UseGuards(AdminAccessGuard)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  createVideo(@Body() dto: CreateVideoDto): Promise<Video> {
    return this.videoService.createVideo(dto);
  }

  @Patch(':id')
  editVideo(
    @Param('id') videoId: string,
    @Body() dto: EditVideoDto,
  ): Promise<Video> {
    return this.videoService.editVideo(videoId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteVideo(@Param('id') videoId: string): Promise<void> {
    return this.videoService.deleteVideo(videoId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('unlock')
  unlockVideo(@Body() dto: ManageVideoDto): Promise<BatchEntity> {
    return this.videoService.unlockVideo(dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('lock')
  lockVideo(@Body() dto: ManageVideoDto): Promise<BatchEntity> {
    return this.videoService.lockVideo(dto);
  }
}
