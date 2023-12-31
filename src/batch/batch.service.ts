import { Injectable } from '@nestjs/common';
import { BatchDto, CreateBatchDto } from './dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetVideosQuery } from '../video/query';
import { VideoDto } from '../video/dto';
import { CreateBatchCommand } from './command';
import { BatchEntity } from './entity';
import { JwtConfig, Payload, Roles, refreshTokenConfig } from '@app/config';
import { JwtService } from '@nestjs/jwt';
import { SaveRefreshTokenCommand } from '../auth/command';
import { FindBatchQuery } from './query';

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

  async getBatchById(batchId: string): Promise<BatchEntity> {
    const batch = await this.queryBus.execute<FindBatchQuery, BatchDto>(
      new FindBatchQuery(batchId),
    );

    return new BatchEntity(batch);
  }

  public generateJWT(payload: Payload, config: JwtConfig): string {
    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }
}
