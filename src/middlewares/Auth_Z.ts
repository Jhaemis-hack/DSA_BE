import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { EXTENDED_ERROR_UNATHORIZED } from "../utils/customErrors";

require("@dotenvx/dotenvx").config();

const user_secret = process.env.JWT_SECRET;

if (!user_secret) {
  throw new Error("JWT Host Secret is not defined in environment variables.");
}

const auth_Z = (...allowedRoles: any[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      (req.user && allowedRoles.includes(req.user.role)) ||
      (req.auth && allowedRoles.includes(req.auth.role))
    ) {
      return next();
    }
    throw EXTENDED_ERROR_UNATHORIZED(
      "Forbidden: you do not have permission to access this resource"
    );
  };
};

export default auth_Z;
