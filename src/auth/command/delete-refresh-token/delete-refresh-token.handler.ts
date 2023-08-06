import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenEntityRepository } from '../../../auth/repository';
import { DeleteRefreshTokenCommand } from './delete-refresh-token.command';
import { ObjectId } from 'mongodb';

@CommandHandler(DeleteRefreshTokenCommand)
export class DeleteRefreshTokenHandler
  implements ICommandHandler<DeleteRefreshTokenCommand>
{
  constructor(
    private readonly refreshTokenEntityRepository: RefreshTokenEntityRepository,
  ) {}

  async execute(command: DeleteRefreshTokenCommand): Promise<void> {
    await this.refreshTokenEntityRepository.findOneAndDelete({
      userId: new ObjectId(command.userId),
    });
  }
}
