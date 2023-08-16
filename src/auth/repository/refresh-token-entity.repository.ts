import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseEntityRepository } from '@app/common';
import { RefreshTokenSchema, RefreshTokenSchemaFactory } from '../schema';
import { RefreshToken } from '../domain';

@Injectable()
export class RefreshTokenEntityRepository extends BaseEntityRepository<
  RefreshTokenSchema,
  RefreshToken
> {
  constructor(
    @InjectModel(RefreshTokenSchema.name)
    readonly refreshTokenModel: Model<RefreshTokenSchema>,
    readonly refreshTokenSchemaFactory: RefreshTokenSchemaFactory,
  ) {
    super(refreshTokenModel, refreshTokenSchemaFactory);
  }
}
