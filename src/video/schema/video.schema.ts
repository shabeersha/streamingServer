import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../../database';

@Schema({ versionKey: false, timestamps: true, collection: 'videos' })
export class VideoSchema extends IdentifiableEntitySchema {
  @Prop({
    required: true,
    unique: true,
  })
  videoKey: number;

  @Prop({
    required: true,
    trim: true,
  })
  videoUrl: string;

  @Prop({
    required: true,
    trim: true,
  })
  videoThumbnail: string;

  @Prop({
    required: true,
  })
  description: string;
}
