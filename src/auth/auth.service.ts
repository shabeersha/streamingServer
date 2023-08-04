import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AdminSigninDto } from './dto';
import { AdminSigninQuery } from './query';
import { SaveRefreshTokenCommand } from './command';
import { AdminDto } from '../admin/dto';
import {
  JwtConfig,
  Payload,
  accessTokenConfig,
  adminRefreshTokenConfig,
} from '../config';

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
      sub: admin._id.toHexString(),
      username: admin.username,
    };

    const accessToken = await this.generateJWT(payload, accessTokenConfig());
    const refreshToken = await this.generateJWT(
      payload,
      adminRefreshTokenConfig(),
    );

    await this.commandBus.execute<SaveRefreshTokenCommand, void>(
      new SaveRefreshTokenCommand({
        userId: admin._id.toHexString(),
        token: refreshToken,
      }),
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  public generateJWT(payload: Payload, config: JwtConfig): string {
    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }
}
