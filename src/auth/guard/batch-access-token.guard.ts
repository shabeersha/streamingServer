import { AuthGuard } from '@nestjs/passport';

export class BatchAccessGuard extends AuthGuard('batch-access-jwt') {
  constructor() {
    super();
  }
}
