// src/modules/identity/index.ts
export { identityRoutes } from "./routes.js";
export {
  requireAuth,
  requireAdmin,
  optionalAuth,
  requireVerifiedEmail,
} from "../../shared/auth/middleware.js";