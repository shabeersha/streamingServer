import { CreateVideoDto } from '../../../video/dto';

export class CreateVideoCommand {
  constructor(public readonly dto: CreateVideoDto) {}
}
