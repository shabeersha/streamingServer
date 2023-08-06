import { AuthGuard } from '@nestjs/passport';

export class BatchRefreshGuard extends AuthGuard('batch-refresh-jwt') {
  constructor() {
    super();
  }
}
