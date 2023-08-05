import { Injectable } from '@nestjs/common';
import { BatchDto, CreateBatchDto } from './dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetVideosQuery } from '../video/query';
import { VideoDto } from '../video/dto';
import { FindBatchQuery } from './query';
import { CreateBatchCommand, UpdateBatchCommand } from './command';
import { BatchEntity } from './entity';
import { Batch } from './domain';
import * as argon from 'argon2';
import { FindRefreshTokenQuery } from '../auth/query';
import { RefreshTokenDto } from '../auth/dto';
import { JwtConfig, Payload, Roles, refreshTokenConfig } from '../config';
import { JwtService } from '@nestjs/jwt';
import { SaveRefreshTokenCommand } from '../auth/command';

@Injectable()
export class BatchService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
  ) {}

  public async createBatch(dto: CreateBatchDto) {
    const videos = await this.queryBus.execute<GetVideosQuery, VideoDto[]>(
      new GetVideosQuery(),
    );

    const batch = await this.queryBus.execute<FindBatchQuery, BatchDto>(
      new FindBatchQuery(dto.branchCode, dto.batchNumber),
    );

    if (batch) {
      const hash = await argon.hash(dto.password);
      const updatedBatch = new Batch(
        batch._id,
        batch.branchCode,
        batch.batchNumber,
        videos,
        hash,
      );

      const newBatch = await this.commandBus.execute<
        UpdateBatchCommand,
        BatchEntity
      >(new UpdateBatchCommand(updatedBatch, videos));

      const payload: Payload = {
        sub: newBatch._id,
        role: Roles.STUDENT,
      };

      const refreshToken = this.generateJWT(payload, refreshTokenConfig());

      await this.commandBus.execute<SaveRefreshTokenCommand, void>(
        new SaveRefreshTokenCommand({
          userId: newBatch._id,
          token: refreshToken,
        }),
      );

      return newBatch;
    }

    const newBatch = await this.commandBus.execute<
      CreateBatchCommand,
      BatchEntity
    >(new CreateBatchCommand(dto, videos));

    const payload: Payload = {
      sub: newBatch._id,
      role: Roles.STUDENT,
    };

    const refreshToken = this.generateJWT(payload, refreshTokenConfig());

    await this.commandBus.execute<SaveRefreshTokenCommand, void>(
      new SaveRefreshTokenCommand({
        userId: newBatch._id,
        token: refreshToken,
      }),
    );

    return newBatch;
  }

  public generateJWT(payload: Payload, config: JwtConfig): string {
    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }
}
