import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSigninDto, BatchSigninDto, TokenDto } from './dto';
import {
  AdminAccessGuard,
  AdminRefreshGuard,
  BatchRefreshGuard,
} from './guard';
import { SerializeUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('admin')
  adminSignin(@Body() dto: AdminSigninDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    return this.authService.adminSignin(dto);
  }

  @UseGuards(AdminRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('admin/refresh')
  refreshAdminToken(
    @SerializeUser('_id') adminId: string,
    @Body() dto: TokenDto,
  ): Promise<{
    access_token: string;
  }> {
    return this.authService.refreshAdminToken(adminId, dto);
  }

  @UseGuards(AdminAccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('admin')
  adminSignOut(
    @SerializeUser('_id') adminId: string,
    @Body('batchId') batchId?: string,
  ): Promise<void> {
    return this.authService.adminSignOut(adminId, batchId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('batch')
  batchSignin(@Body() dto: BatchSigninDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    return this.authService.batchSignin(dto);
  }

  @UseGuards(BatchRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('batch/refresh')
  refreshBatchToken(
    @SerializeUser('_id') batchId: string,
    @Body() dto: TokenDto,
  ): Promise<{
    access_token: string;
  }> {
    return this.authService.refreshBatchToken(batchId, dto);
  }
}
