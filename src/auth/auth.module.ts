import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthQueryHandlers } from './query';
import { AdminModule } from '../admin/admin.module';
import { AuthCommandHandlers } from './command';
import {
  RefreshTokenDtoRepository,
  RefreshTokenEntityRepository,
} from './repository';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { RefreshTokenSchema, RefreshTokenSchemaFactory } from './schema';
import { RefreshTokenFactory } from './domain';
import {
  AdminAccessTokenStrategy,
  AdminRefreshTokenStrategy,
  BatchAccessTokenStrategy,
  BatchRefreshTokenStrategy,
  CommonAccessTokenStrategy,
} from './strategy';
import { BatchModule } from '../batch/batch.module';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: RefreshTokenSchema.name,
        schema: SchemaFactory.createForClass(RefreshTokenSchema),
      },
    ]),
    AdminModule,
    BatchModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenEntityRepository,
    RefreshTokenSchemaFactory,
    RefreshTokenFactory,
    RefreshTokenDtoRepository,
    AdminAccessTokenStrategy,
    AdminRefreshTokenStrategy,
    BatchAccessTokenStrategy,
    BatchRefreshTokenStrategy,
    CommonAccessTokenStrategy,
    ...AuthQueryHandlers,
    ...AuthCommandHandlers,
  ],
})
export class AuthModule {}
