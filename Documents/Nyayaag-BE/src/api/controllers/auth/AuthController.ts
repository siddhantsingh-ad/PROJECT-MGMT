import { Handler } from "express";
import Auth from "../../models/auth/authModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../../models/auth/authModel";
import { SendOtpVerificationEmail } from "./OtpController";

const Login: Handler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Auth.findOne({ username: username });
    const userPassword: string = user?.password || "";
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid Credentials", success: false, status: 404 });
    }
    if (!user?.verified) {
      return res.status(404).json({
        status: "FAILED",
        message: "Please verify the usernaem to login!!",
      });
    }
    if (await bcrypt.compare(password, userPassword)) {
      req.session.user = user?._id;
      req.session.save((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(req.session);
        }
      });
      user.sessionId = req.session.id;
      await user.save();
      return res
        .status(200)
        .json({
          status: "ok",
          session: req.session,
          userType: user?.userType,
          data: user?.username,
        });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid Credentials", success: false, status: 401 });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, msg: err });
  }
};

const Register: Handler = async (req, res) => {
  try {
    const {
      username,
      password,
      confirmPassword,
      securityQuestion,
      securityAnswer,
      userType,
    } = req.body;
    const duplicates = await UserModel.findOne({ username: username }).exec();
    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({
          message: "Password and confirm password doesn't match.",
          success: false,
          status: 401,
        });
    }
    if (duplicates) {
      return res
        .status(409)
        .json({
          message: "User name is already taken.",
          success: false,
          status: 409,
        }); // if we find duplicates
    }
    try {
      const hashed = await bcrypt.hash(password, 10);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await UserModel.create({
        username: username,
        password: hashed,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        verified: false,
        userType: userType,
      });
      console.log(req);
      SendOtpVerificationEmail(username, res);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err, success: false, status: 500 });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, msg: err });
  }
};

export { Login, Register };
