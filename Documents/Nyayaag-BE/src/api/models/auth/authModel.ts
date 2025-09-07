import { Schema , model , Model } from "mongoose";
import IAuth from "./InterfaceAuth";

const AuthSchema: Schema = new Schema({
    username: {
        type: String,
        required:true,
    },
    sessionId: {
        type: String,
        default: undefined
    },
    password: {
        type: String,
        required:true,
    },
    securityQuestion: {
        type: String,
        required: true
    },
    securityAnswer: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
    },
    userType: {
        type: String,
        default: "client"
    }
})

const Auth: Model<IAuth> = model<IAuth>("auth_user", AuthSchema);

export default Auth;