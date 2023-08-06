import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSigninDto, BatchSigninDto, TokenDto } from './dto';
import { AdminRefreshGuard } from './guard';
import { SerializeAdmin } from './decorator';

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
    @SerializeAdmin('_id') adminId: string,
    @Body() dto: TokenDto,
  ): Promise<{
    access_token: string;
  }> {
    return this.authService.refreshAdminToken(adminId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('batch')
  batchSignin(@Body() dto: BatchSigninDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    return this.authService.batchSignin(dto);
  }
}
