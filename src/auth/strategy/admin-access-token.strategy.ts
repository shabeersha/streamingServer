import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload, Roles, accessTokenConfig } from '@app/common';
import { FindAdminQuery } from '../../admin/query';
import { AdminDto } from '../../admin/dto';

@Injectable()
export class AdminAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'admin-access-jwt',
) {
  constructor(private readonly queryBus: QueryBus) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: accessTokenConfig().secret,
    });
  }

  async validate(payload: Payload): Promise<AdminDto> {
    if (payload.role !== Roles.ADMIN) {
      throw new UnauthorizedException('Access denied');
    }

    return await this.queryBus.execute<FindAdminQuery, AdminDto>(
      new FindAdminQuery(payload.sub),
    );
  }
}
