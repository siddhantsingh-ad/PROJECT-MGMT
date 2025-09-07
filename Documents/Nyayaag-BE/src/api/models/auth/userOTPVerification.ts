import { Schema , model , Model } from "mongoose";
import InterfaceOTPVerification from "./InterfaceOTPVerification";

const userOTPVerification: Schema = new Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
})

const OTPVerification: Model<InterfaceOTPVerification> = model<InterfaceOTPVerification>("userOTPVerification", userOTPVerification);

export default OTPVerification;