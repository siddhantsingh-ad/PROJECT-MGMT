// ! Interface for the Client Model

import { Document } from "mongoose";
import { NextFunction } from "express";

export default interface IClient extends Document {
  personalDetails?: PersonalDetails;

  // Methods
  comparePassword(inputPassword: string, next: NextFunction): Promise<boolean>;
}

interface PersonalDetails {
  name?: string;
  gender?: string;
  emailAddress?: string;
  phoneNo?: number;
  address?: string;
  pincode: number;
}