import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import {
  accessTokenConfig,
  adminRefreshTokenConfig,
  refreshTokenConfig,
} from '@app/config';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { BatchModule } from './batch/batch.module';
import { AppGateway } from './app.gateway';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [accessTokenConfig, refreshTokenConfig, adminRefreshTokenConfig],
    }),
    DatabaseModule,
    AdminModule,
    AuthModule,
    VideoModule,
    BatchModule,
    SocketModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
