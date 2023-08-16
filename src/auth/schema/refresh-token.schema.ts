import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { IdentifiableEntitySchema } from '@app/common';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'refreshtokens',
})
export class RefreshTokenSchema extends IdentifiableEntitySchema {
  @Prop({
    required: true,
    unique: true,
  })
  public readonly userId: ObjectId;

  @Prop({
    required: true,
  })
  public readonly token: string;
}
