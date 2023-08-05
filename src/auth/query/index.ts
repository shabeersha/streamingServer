import { AdminSigninHandler } from './admin-signin/admin-signin.handler';
import { FindAdminHandler } from './find-admin/find-admin.handler';
import { FindRefreshTokenHandler } from './find-refresh-token/find-refresh-token.handler';

export const AuthQueryHandlers = [
  AdminSigninHandler,
  FindAdminHandler,
  FindRefreshTokenHandler,
];

export * from './admin-signin/admin-signin.query';
export * from './find-admin/find-admin.query';
export * from './find-refresh-token/find-refresh-token.query';
