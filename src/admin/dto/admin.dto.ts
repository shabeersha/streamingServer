import { ObjectId } from 'mongodb';

export class AdminDto {
  readonly _id: ObjectId;
  readonly username: string;
  readonly name?: string;
  readonly password?: string;
}
