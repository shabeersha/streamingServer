import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AdminSigninDto, RefreshTokenDto, TokenDto } from './dto';
import { AdminSigninQuery } from './query';
import { SaveRefreshTokenCommand } from './command';
import { AdminDto } from '../admin/dto';
import {
  JwtConfig,
  Payload,
  Roles,
  accessTokenConfig,
  adminRefreshTokenConfig,
} from '../config';
import { FindRefreshTokenQuery } from './query/find-refresh-token/find-refresh-token.query';

@Injectable()
export class AuthService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
  ) {}

  public async adminSignin(dto: AdminSigninDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const admin = await this.queryBus.execute<AdminSigninQuery, AdminDto>(
      new AdminSigninQuery(dto),
    );

    const payload: Payload = {
      sub: admin._id,
      role: Roles.ADMIN,
    };

    const accessToken = await this.generateJWT(payload, accessTokenConfig());
    const refreshToken = await this.generateJWT(
      payload,
      adminRefreshTokenConfig(),
    );

    await this.commandBus.execute<SaveRefreshTokenCommand, void>(
      new SaveRefreshTokenCommand({
        userId: admin._id,
        token: refreshToken,
      }),
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  public async refreshAdminToken(
    adminId: string,
    dto: TokenDto,
  ): Promise<{ access_token: string }> {
    const refreshToken = this.queryBus.execute<
      FindRefreshTokenQuery,
      RefreshTokenDto
    >(new FindRefreshTokenQuery(dto.token));

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload: Payload = {
      sub: adminId,
      role: Roles.ADMIN,
    };

    const accessToken = await this.generateJWT(payload, accessTokenConfig());

    return {
      access_token: accessToken,
    };
  }

  public generateJWT(payload: Payload, config: JwtConfig): string {
    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }
}
