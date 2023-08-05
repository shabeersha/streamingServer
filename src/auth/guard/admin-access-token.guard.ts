import { AuthGuard } from '@nestjs/passport';

export class AdminAccessGuard extends AuthGuard('admin-access-jwt') {
  constructor() {
    super();
  }
}
