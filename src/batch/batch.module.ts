import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { CqrsModule } from '@nestjs/cqrs';
import { BatchQueryHandlers } from './query';
import { BatchDtoRepository, BatchEntityRepository } from './repository';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { BatchSchema, BatchSchemaFactory } from './schema';
import { BatchCommandHandlers } from './command';
import { BatchFactory } from './domain';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: BatchSchema.name,
        schema: SchemaFactory.createForClass(BatchSchema),
      },
    ]),
    JwtModule.register({}),
  ],
  controllers: [BatchController],
  providers: [
    BatchService,
    BatchEntityRepository,
    BatchDtoRepository,
    BatchSchemaFactory,
    BatchFactory,
    ...BatchQueryHandlers,
    ...BatchCommandHandlers,
  ],
  exports: [MongooseModule, BatchDtoRepository],
})
export class BatchModule {}
