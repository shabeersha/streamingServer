import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload, Roles, accessTokenConfig } from '@app/config';
import { BatchDto } from '../../batch/dto';
import { FindBatchQuery } from '../../batch/query';

@Injectable()
export class BatchAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'batch-access-jwt',
) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenConfig().secret,
    });
  }

  async validate(payload: Payload): Promise<BatchDto> {
    if (payload.role !== Roles.STUDENT) {
      throw new UnauthorizedException('Access denied');
    }

    return await this.queryBus.execute<FindBatchQuery, BatchDto>(
      new FindBatchQuery(payload.sub),
    );
  }
}
