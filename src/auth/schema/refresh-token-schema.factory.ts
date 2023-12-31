import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { RefreshTokenSchema } from './refresh-token.schema';
import { RefreshToken } from '../domain';
import { EntitySchemaFactory } from '@app/common';

@Injectable()
export class RefreshTokenSchemaFactory
  implements EntitySchemaFactory<RefreshTokenSchema, RefreshToken>
{
  create(refreshtoken: RefreshToken): RefreshTokenSchema {
    return {
      _id: new ObjectId(refreshtoken.getId()),
      userId: new ObjectId(refreshtoken.getUserId()),
      token: refreshtoken.getToken(),
    };
  }
  createFromSchema(refreshTokenSchema: RefreshTokenSchema): RefreshToken {
    return new RefreshToken(
      refreshTokenSchema._id.toHexString(),
      refreshTokenSchema.userId.toHexString(),
      refreshTokenSchema.token,
    );
  }
}
