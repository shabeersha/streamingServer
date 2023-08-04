import { SaveRefreshTokenDto } from '../../../auth/dto';

export class SaveRefreshTokenCommand {
  constructor(public readonly dto: SaveRefreshTokenDto) {}
}
