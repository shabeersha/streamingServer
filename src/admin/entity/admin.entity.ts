import { Exclude, Expose, Transform } from 'class-transformer';

export class AdminEntity {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  public readonly _id: string;

  public readonly username: string;
  public readonly name: string;

  @Exclude()
  public readonly password: string;

  constructor(partial: Partial<AdminEntity>) {
    Object.assign(this, partial);
  }
}
