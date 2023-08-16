import { Prop, Schema } from '@nestjs/mongoose';
import { IdentifiableEntitySchema } from '@app/common';

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
  public readonly username: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 3,
  })
  public readonly name: string;

  @Prop({
    required: true,
  })
  public readonly password: string;
}
