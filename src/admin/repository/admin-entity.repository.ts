import { Injectable } from '@nestjs/common';
import { BaseEntityRepository } from '../../database';
import { AdminSchema, AdminSchemaFactory } from '../schema';
import { Admin } from '../domain';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AdminEntityRepository extends BaseEntityRepository<
  AdminSchema,
  Admin
> {
  constructor(
    @InjectModel(AdminSchema.name)
    readonly adminModel: Model<AdminSchema>,
    readonly adminSchemaFactory: AdminSchemaFactory,
  ) {
    super(adminModel, adminSchemaFactory);
  }
}
