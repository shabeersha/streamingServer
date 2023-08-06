import { AuthGuard } from '@nestjs/passport';

export class CommonAccessGuard extends AuthGuard('common-access-jwt') {
  constructor() {
    super();
  }
}
