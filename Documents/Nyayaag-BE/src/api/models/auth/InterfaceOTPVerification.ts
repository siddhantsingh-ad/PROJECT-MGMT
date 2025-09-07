// ! Interface for the User OTP Verification Model

import { Document } from "mongoose";
import { NextFunction } from "express";

export default interface IAdvocate extends Document {
  userId?: string;
  otp: string;
  createdAt?: Date;
  expiresAt: Date;
  // Methods
  comparePassword(inputPassword: string, next: NextFunction): Promise<boolean>;
}