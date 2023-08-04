import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminDtoRepository, AdminEntityRepository } from './repository';
import { AdminSchema, AdminSchemaFactory } from './schema';
import { AdminFactory } from './domain';
import { AdminCommandHandlers } from './command';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: AdminSchema.name,
        schema: SchemaFactory.createForClass(AdminSchema),
      },
    ]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminEntityRepository,
    AdminDtoRepository,
    AdminSchemaFactory,
    AdminFactory,
    ...AdminCommandHandlers,
  ],
  exports: [MongooseModule, AdminDtoRepository],
})
export class AdminModule {}
