// ! Interface for the Auth Model

import { Document } from "mongoose";
import { NextFunction } from "express";

export default interface IAuth extends Document {
  username?: string;
  sessionId?: string;
  password: string;
  securityQuestion?: string;
  securityAnswer?: string;
  verified?: boolean;
  userType? : string | "client";

  // Methods
  comparePassword(inputPassword: string, next: NextFunction): Promise<boolean>;
}