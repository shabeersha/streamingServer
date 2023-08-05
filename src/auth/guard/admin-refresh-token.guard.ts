import { AuthGuard } from '@nestjs/passport';

export class AdminRefreshGuard extends AuthGuard('admin-refresh-jwt') {
  constructor() {
    super();
  }
}
