import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { EntityFactory } from '../../database';
import { RefreshToken } from '.';
import { RefreshTokenEntityRepository } from '../repository';

@Injectable()
export class RefreshTokenFactory implements EntityFactory<RefreshToken> {
  constructor(
    @Inject(forwardRef(() => RefreshTokenEntityRepository))
    private readonly refreshtokenEntityRepository: RefreshTokenEntityRepository,
  ) {}

  async create(userId: string, token: string): Promise<RefreshToken> {
    const refreshToken = new RefreshToken(
      new ObjectId().toHexString(),
      new ObjectId(userId).toHexString(),
      token,
    );

    await this.refreshtokenEntityRepository.create(refreshToken);
    return refreshToken;
  }
}
