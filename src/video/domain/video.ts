import { AggregateRoot } from '@nestjs/cqrs';
import { EditVideoDto } from '../dto';

export class Video extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private videoKey: number,
    private videoUrl: string,
    private videoThumbnail: string,
    private description: string,
  ) {
    super();
  }

  getId(): string {
    return this._id;
  }

  getVideoKey(): number {
    return this.videoKey;
  }

  getVideoUrl(): string {
    return this.videoUrl;
  }

  getVideoThumbnail(): string {
    return this.videoThumbnail;
  }

  getDescription(): string {
    return this.description;
  }

  async editVideo(dto: EditVideoDto) {
    this.videoKey = dto.videoKey ? dto.videoKey : this.videoKey;
    this.videoUrl = dto.videoUrl ? dto.videoUrl : this.videoUrl;
    this.videoThumbnail = dto.videoThumbnail
      ? dto.videoThumbnail
      : this.videoThumbnail;
    this.description = dto.description ? dto.description : this.description;
  }
}
