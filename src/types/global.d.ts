// src/types/express/index.d.ts
import { UserJwtPayload } from "../modules/auth/auth.interface";

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}

export {}; // ✅ IMPORTANT to make it a module