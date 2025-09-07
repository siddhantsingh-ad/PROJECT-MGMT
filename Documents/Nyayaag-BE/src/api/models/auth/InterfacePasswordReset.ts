// ! Interface for the User Password Rest Model

import { Document } from "mongoose";

export default interface IPasswordRest extends Document {
  username?: string;
  resetString: string;
  createdAt?: Date;
  expiresAt: Date;
}