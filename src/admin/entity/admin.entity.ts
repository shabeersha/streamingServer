import { Exclude } from 'class-transformer';

export class AdminEntity {
  public readonly _id: string;
  public readonly username: string;
  public readonly name: string;

  @Exclude()
  public readonly password: string;

  constructor(partial: Partial<AdminEntity>) {
    Object.assign(this, partial);
  }
}
