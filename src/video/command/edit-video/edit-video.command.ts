import { EditVideoDto } from '../../../video/dto';

export class EditVideoCommand {
  constructor(
    public readonly videoId: string,
    public readonly dto: EditVideoDto,
  ) {}
}
