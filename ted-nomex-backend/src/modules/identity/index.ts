// src/modules/identity/index.ts
export { identityRoutes } from "./routes.js";
export {
  requireAuth,
  requireAdmin,
  optionalAuth,
} from "../../shared/auth/middleware.js";