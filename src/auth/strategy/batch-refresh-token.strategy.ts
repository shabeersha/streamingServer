import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload, Roles, refreshTokenConfig } from '@app/config';
import { FindBatchQuery } from '../../batch/query';
import { BatchDto } from '../../batch/dto';

@Injectable()
export class BatchRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'batch-refresh-jwt',
) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: refreshTokenConfig().secret,
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
