import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AdminSigninDto,
  BatchSigninDto,
  RefreshTokenDto,
  TokenDto,
} from './dto';
import { AdminSigninQuery, BatchSigninQuery } from './query';
import { DeleteRefreshTokenCommand, SaveRefreshTokenCommand } from './command';
import { AdminDto } from '../admin/dto';
import {
  JwtConfig,
  Payload,
  Roles,
  accessTokenConfig,
  adminRefreshTokenConfig,
  refreshTokenConfig,
} from '../config';
import { FindRefreshTokenQuery } from './query/find-refresh-token/find-refresh-token.query';
import { BatchDto } from '../batch/dto';
import { GetVideosQuery } from '../video/query';
import { VideoDto } from '../video/dto';
import { EditBatchCommand } from '../batch/command';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
    private readonly socketService: SocketService,
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
    const refreshToken = await this.queryBus.execute<
      FindRefreshTokenQuery,
      RefreshTokenDto
    >(new FindRefreshTokenQuery({ token: dto.token }));

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

  public async adminSignOut(adminId: string, batchId?: string): Promise<void> {
    if (batchId) {
      const videos = await this.queryBus.execute<GetVideosQuery, VideoDto[]>(
        new GetVideosQuery(),
      );

      await this.commandBus.execute<EditBatchCommand>(
        new EditBatchCommand(
          batchId,
          { password: Math.random().toString(36).slice(-8) },
          videos,
        ),
      );

      await this.commandBus.execute<DeleteRefreshTokenCommand>(
        new DeleteRefreshTokenCommand(batchId),
      );

      this.socketService.handleEmitSignout(batchId);
    }

    return await this.commandBus.execute<DeleteRefreshTokenCommand>(
      new DeleteRefreshTokenCommand(adminId),
    );
  }

  public async batchSignin(dto: BatchSigninDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const batch = await this.queryBus.execute<BatchSigninQuery, BatchDto>(
      new BatchSigninQuery(dto),
    );

    const { token } = await this.queryBus.execute<
      FindRefreshTokenQuery,
      RefreshTokenDto
    >(new FindRefreshTokenQuery({ userId: batch._id }));

    const payload: Payload = await this.verifyBatchRefreshToken(token);

    const accessToken = this.generateJWT(payload, accessTokenConfig());

    return {
      access_token: accessToken,
      refresh_token: token,
    };
  }

  public async refreshBatchToken(
    batchId: string,
    dto: TokenDto,
  ): Promise<{ access_token: string }> {
    const refreshToken = await this.queryBus.execute<
      FindRefreshTokenQuery,
      RefreshTokenDto
    >(new FindRefreshTokenQuery({ token: dto.token }));

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const payload: Payload = {
      sub: batchId,
      role: Roles.STUDENT,
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

  public async verifyBatchRefreshToken(refreshToken: string): Promise<Payload> {
    const { sub, role } = await this.jwtService.verifyAsync(
      refreshToken,
      refreshTokenConfig(),
    );

    return { sub, role };
  }
}
