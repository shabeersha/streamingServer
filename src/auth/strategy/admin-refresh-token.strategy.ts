import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Roles } from '../../config';
import { FindAdminQuery } from '../query/find-admin/find-admin.query';
import { AdminDto } from '../../admin/dto';

@Injectable()
export class AdminRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'admin-refresh-jwt',
) {
  constructor(
    readonly config: ConfigService,
    private readonly queryBus: QueryBus,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: config.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: { sub: string; role: Roles }): Promise<AdminDto> {
    if (payload.role !== Roles.ADMIN) {
      throw new UnauthorizedException('Access denied');
    }

    return await this.queryBus.execute<FindAdminQuery, AdminDto>(
      new FindAdminQuery(payload.sub),
    );
  }
}
