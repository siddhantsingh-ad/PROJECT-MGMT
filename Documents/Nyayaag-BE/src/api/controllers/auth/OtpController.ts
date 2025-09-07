import bcrypt from "bcrypt";
import { Handler } from "express";
import transporter from "../../utils/nodeMail";
import OTPVerification from "../../models/auth/userOTPVerification";
import Advocate from "../../models/auth/authModel";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SendOtpVerificationEmail = async (username: string, res: any) => {
  try {
    transporter.verify(async (error, success) => {
      if (error) {
        console.log(error, "email service isn't working");
      } else {
        console.log(success, "Mail is ready");
        console.log(username, success);
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
          from: process.env.EMAIL,
          to: username,
          subject: "verify your email",
          html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the registration process </p><p>This code <b>expired in 1 hour</b>.</p>`,
        };
        const hashedotp = await bcrypt.hash(otp, 10);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await OTPVerification.create({
          username: username,
          otp: hashedotp,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });
        transporter.sendMail(mailOptions);
        return res
          .status(201)
          .json({ message: `Otp sent`, success: true, status: 201 });
      }
    });
  } catch (error) {
    return res.json({ status: 500, msg: error });
  }
};

const ResendOTPVerification: Handler = async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);
    if (!username) {
      console.log("Empty user details are not allowed!");
      throw Error("Empty user details are not allowed!");
    } else {
      await OTPVerification.deleteMany({ username });
      SendOtpVerificationEmail(username, res);
    }
  } catch (error) {
    return res.json({
      status: "FAILED",
      msg: error,
    });
  }
};

const VerifyOtp: Handler = async (req, res) => {
  try {
    const { username, otp } = req.body;
    console.log(username, otp);
    if (!username || !otp) {
      throw Error("empty otp details are not allowed");
    } else {
      const userOTPVerificationRecords = await OTPVerification.find({
        username,
      });
      if (userOTPVerificationRecords.length <= 0) {
        // no records found
        throw new Error(
          "the account does exists or has been verified already!!"
        );
      } else {
        const { expiresAt } = userOTPVerificationRecords[0];
        console.log(expiresAt);
        const currentTime = Date.now();
        const hashedOTP = userOTPVerificationRecords[0].otp;
        if (expiresAt.getTime() < currentTime) {
          await OTPVerification.deleteMany({ username });
          console.log(hashedOTP, "working");
          throw new Error("Code has been expired. Please request again!");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            // input otp is wrong
            throw new Error("Invalid Otp");
          } else {
            console.log("otp is matched");
            await Advocate.updateOne(
              { username: username },
              { verified: true }
            );
            await OTPVerification.deleteMany({ username: username });
            return res.json({
              status: "VERIFIED",
              message: "user email verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    return res.json({ status: "FAILED", msg: error });
  }
};

export { ResendOTPVerification, SendOtpVerificationEmail, VerifyOtp };
