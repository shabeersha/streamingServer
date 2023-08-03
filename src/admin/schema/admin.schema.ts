import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '../../database';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'admins',
})
export class AdminSchema extends IdentifiableEntitySchema {
  @Prop({
    unique: true,
    required: true,
    trim: true,
    minlength: 4,
  })
  username: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 3,
  })
  name: string;

  @Prop({
    required: true,
  })
  password: string;
}
