import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshTokenSchema, RefreshTokenSchemaFactory } from '../schema';
import { RefreshToken } from '../domain';
import { BaseEntityRepository } from '../../database';

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
