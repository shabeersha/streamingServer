import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '@app/common';
import { VideoDto } from '../../video/dto';

@Schema({ versionKey: false, timestamps: true, collection: 'batches' })
export class BatchSchema extends IdentifiableEntitySchema {
  @Prop({
    required: true,
    minlength: 3,
  })
  branchCode: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
  })
  batchNumber: number;

  @Prop({
    required: true,
    ref: 'Video',
  })
  videos: VideoDto[];

  @Prop({
    required: true,
  })
  password: string;
}
