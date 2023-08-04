import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveRefreshTokenCommand } from './save-refresh-token.command';
import { RefreshTokenEntityRepository } from '../../../auth/repository';
import { RefreshTokenFactory } from '../../../auth/domain';
import { ObjectId } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { RefreshTokenSchema } from 'src/auth/schema';

@CommandHandler(SaveRefreshTokenCommand)
export class SaveRefreshTokenHandler
  implements ICommandHandler<SaveRefreshTokenCommand>
{
  constructor(
    private readonly refreshTokenEntityRepository: RefreshTokenEntityRepository,
    private readonly refreshTokenFactory: RefreshTokenFactory,
  ) {}

  async execute(command: SaveRefreshTokenCommand): Promise<void> {
    const refreshToken = await this.refreshTokenEntityRepository.findOne({
      userId: new ObjectId(command.dto.userId),
    } as FilterQuery<RefreshTokenSchema>);

    if (refreshToken) {
      refreshToken.updateRefreshToken(command.dto.token);

      await this.refreshTokenEntityRepository.findOneAndUpdateById(
        refreshToken.getId(),
        refreshToken,
      );

      return refreshToken.commit();
    }

    await this.refreshTokenFactory.create(
      command.dto.userId,
      command.dto.token,
    );
  }
}
