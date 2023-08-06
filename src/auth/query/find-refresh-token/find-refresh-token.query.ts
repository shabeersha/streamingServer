import { FindRefreshTokenDto } from '../../../auth/dto';

export class FindRefreshTokenQuery {
  constructor(public readonly dto: FindRefreshTokenDto) {}
}
