import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload, Roles, accessTokenConfig } from '@app/config';
import { FindAdminQuery } from '../../admin/query';
import { AdminDto } from '../../admin/dto';
import { FindBatchQuery } from '../../batch/query';
import { BatchDto } from '../../batch/dto';

@Injectable()
export class CommonAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'common-access-jwt',
) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenConfig().secret,
    });
  }

  async validate(payload: Payload): Promise<AdminDto | BatchDto> {
    if (payload.role == Roles.ADMIN) {
      return await this.queryBus.execute<FindAdminQuery, AdminDto>(
        new FindAdminQuery(payload.sub),
      );
    }

    return await this.queryBus.execute<FindBatchQuery, BatchDto>(
      new FindBatchQuery(payload.sub),
    );
  }
}
