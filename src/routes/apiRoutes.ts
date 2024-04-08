import { Router } from 'express';
import AuthRoutes from '../users/services/routes/AuthRoutes';
import UserRoutes from '../users/services/routes/UserRoutes';
import CompaniesRoutes from '../companies/services/routes/CompanyRoutes';
import CompanyApiKeysRoutes from '../companies/services/routes/CompanyApiKeyRoutes';
import RoleRoutes from '../users/services/routes/RoleRoutes';
import UtilsRoutes from '../utils/services/routes/UtilRoutes';

const apiRoutes = [
  ...AuthRoutes,
  ...UserRoutes,
  ...CompaniesRoutes,
  ...CompanyApiKeysRoutes,
  ...RoleRoutes,
  ...UtilsRoutes,
];

function generateRoutes(_router, _routes) {
  for (const route of _routes) {
    const { method, path, handler } = route;
    _router[method](path, handler);
  }
  return _router;
}

export default generateRoutes(Router(), apiRoutes);
