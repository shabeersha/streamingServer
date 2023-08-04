import { AggregateRoot } from '@nestjs/cqrs';

export class RefreshToken extends AggregateRoot {
  constructor(
    public readonly _id: string,
    public readonly userId: string,
    public token: string,
  ) {
    super();
  }

  getId(): string {
    return this._id;
  }

  getUserId(): string {
    return this.userId;
  }

  getToken(): string {
    return this.token;
  }

  updateRefreshToken(token: string): void {
    this.token = token;
  }
}
