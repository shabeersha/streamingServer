import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import {
  accessTokenConfig,
  adminRefreshTokenConfig,
  refreshTokenConfig,
} from './config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [accessTokenConfig, refreshTokenConfig, adminRefreshTokenConfig],
    }),
    DatabaseModule,
    AdminModule,
    AuthModule,
  ],
})
export class AppModule {}
