import { ObjectId } from 'mongodb';

export class RefreshTokenDto {
  readonly _id: ObjectId;
  readonly userId: ObjectId;
  readonly token: string;
}
