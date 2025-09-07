import { Schema , model , Model } from "mongoose";
import InterfacePasswordReset from "./InterfacePasswordReset";

const PasswordResetSchema : Schema = new Schema({
    username: String,
    resetString: String,
    createdAt: Date,
    expiresAt: Date,
})

const PasswordReset: Model<InterfacePasswordReset> = model<InterfacePasswordReset>("PasswordResetSchema", PasswordResetSchema);

export default PasswordReset;