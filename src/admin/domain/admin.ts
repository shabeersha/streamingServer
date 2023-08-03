import { AggregateRoot } from '@nestjs/cqrs';

export class Admin extends AggregateRoot {
  constructor(
    public readonly _id: string,
    public username: string,
    public name: string,
    public password: string,
  ) {
    super();
  }

  getId(): string {
    return this._id;
  }

  getUserName(): string {
    return this.username;
  }

  getName(): string {
    return this.name;
  }

  getPassword(): string {
    return this.password;
  }
}
