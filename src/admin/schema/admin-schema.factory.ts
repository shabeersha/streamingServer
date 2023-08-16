import { Injectable } from '@nestjs/common';
import { EntitySchemaFactory } from '@app/common';
import { AdminSchema } from '.';
import { Admin } from '../domain';
import { ObjectId } from 'mongodb';

@Injectable()
export class AdminSchemaFactory
  implements EntitySchemaFactory<AdminSchema, Admin>
{
  create(admin: Admin): AdminSchema {
    return {
      _id: new ObjectId(admin.getId()),
      username: admin.getUserName(),
      name: admin.getName(),
      password: admin.getPassword(),
    };
  }
  createFromSchema(adminSchema: AdminSchema): Admin {
    return new Admin(
      adminSchema._id.toHexString(),
      adminSchema.username,
      adminSchema.name,
      adminSchema.password,
    );
  }
}
