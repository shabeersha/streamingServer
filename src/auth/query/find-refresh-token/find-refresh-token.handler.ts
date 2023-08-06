import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRefreshTokenQuery } from './find-refresh-token.query';
import { RefreshTokenDtoRepository } from '../../repository';
import { RefreshTokenDto } from '../../dto';

@QueryHandler(FindRefreshTokenQuery)
export class FindRefreshTokenHandler
  implements IQueryHandler<FindRefreshTokenQuery>
{
  constructor(
    private readonly refreshTokenDtoRepository: RefreshTokenDtoRepository,
  ) {}

  async execute(query: FindRefreshTokenQuery): Promise<RefreshTokenDto> {
    if (query.dto.token) {
      return await this.refreshTokenDtoRepository.findRefreshToken(
        query.dto.token,
      );
    }

    if (query.dto.userId) {
      return await this.refreshTokenDtoRepository.findRefreshTokenByUserId(
        query.dto.userId,
      );
    }
  }
}
