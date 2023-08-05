import { AdminSigninHandler } from './admin-signin/admin-signin.handler';
import { FindAdminHandler } from './find-admin/find-admin.handler';

export const AuthQueryHandlers = [AdminSigninHandler, FindAdminHandler];

export * from './admin-signin/admin-signin.query';
export * from './find-admin/find-admin.query';
