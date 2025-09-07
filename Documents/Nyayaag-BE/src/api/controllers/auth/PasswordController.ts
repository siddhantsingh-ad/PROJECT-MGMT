import bcrypt from "bcrypt";
import { Handler } from "express";
import Auth from "../../models/auth/authModel";
import PasswordReset from "../../models/auth/passwordReset";
import { v4 as uuidv4 } from "uuid";
import transporter from "../../utils/nodeMail";

const ResetPassword: Handler = async (req, res) => {
  try {
    const { username, resetString, newPassword } = req.body;

    PasswordReset.find({ username: username })
      .then((result) => {
        if (result) {
          console.log(result);
          // password reset record exists
          const { expiresAt } = result[0];
          const HashedResetString = result[0].resetString;
          const currentTime = Date.now();
          if (expiresAt.getTime() < currentTime) {
            PasswordReset.deleteOne({ username })
              .then(() => {
                return res.json({
                  status: "FAILED",
                  message: "Password Link has been Expired.",
                });
              })
              .catch((error) => {
                console.log(error);
                return res.json({
                  status: "FAILED",
                  message: "password reset request not found.",
                });
              });
          } else {
            // valid reset records exists so we validate the reset string
            // First compare the hashed reset string

            bcrypt
              .compare(resetString, HashedResetString)
              .then((result) => {
                if (result) {
                  console.log(result);
                  bcrypt
                    .hash(newPassword, 10)
                    .then((hashedNewPassword) => {
                      // update user password
                      Auth.updateOne(
                        { username: username },
                        { password: hashedNewPassword }
                      )
                        .then(() => {
                          PasswordReset.deleteOne({ username: username })
                            .then(() => {
                              return res.json({
                                status: "SUCCESS",
                                message: "Password Update was successfull.",
                              });
                            })
                            .catch((err) => {
                              console.log(err);
                              return res.json({
                                status: "FAILED",
                                message:
                                  "An error occured while finalizing password reset.",
                              });
                            });
                        })
                        .catch((err) => {
                          console.log(err);
                          return res.json({
                            status: "FAILED",
                            message: "Updating user password failed.",
                          });
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.json({
                        status: "FAILED",
                        message: "Error while hashing new password.",
                      });
                    });
                } else {
                  return res.json({
                    status: "FAILED",
                    message: "Invaild Password reset details passed.",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                return res.json({
                  status: "FAILED",
                  message: "Comparing password reset string failed.",
                });
              });
          }
        } else {
          return res.json({
            status: "FAILED",
            message: "password reset request not found.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.json({
          status: "FAILED",
          message: "Checking for password reset record failed!",
        });
      });
  } catch (error) {
    return res.json({ status: 500, msg: error });
  }
};

const ForgotPassword: Handler = async (req, res) => {
  try {
    const { username, redirectUrl } = req.body;
    console.log(username);
    Auth.findOne({ username: username })
      .then((data) => {
        if (data) {
          console.log(data);
          if (data.verified === false) {
            // user is not verfied!!
            return res.json({
              status: "FAILED",
              message: "Account is not validated yet!!",
            });
          } else {
            const resetString = uuidv4() + username;

            PasswordReset.deleteMany({ username: username })
              .then((result) => {
                console.log(result);
                // reset records deleted successfully
                const mailOptions = {
                  from: process.env.EMAIL,
                  to: username,
                  subject: "Password Reset",
                  html: `<p>click the link below to reset your password
                                      <a href=${
                                        redirectUrl +
                                        "/" +
                                        username +
                                        "/" +
                                        resetString
                                      }>Click here</a>
                                      </p>`,
                };

                bcrypt
                  .hash(resetString, 10)
                  .then(async (hashedResetString: string) => {
                    console.log(hashedResetString);
                    const result = await PasswordReset.create({
                      username: username,
                      resetString: hashedResetString,
                      createdAt: Date.now(),
                      expiresAt: Date.now() + 3600000,
                    });
                    if (!result) {
                      return res.json({
                        status: "FAILED",
                        message: "Failed Saving data in data base!!",
                      });
                    } else {
                      transporter
                        .sendMail(mailOptions)
                        .then(() => {
                          // reset email sent and password reset record saved
                          return res.json({
                            status: "PENDING",
                            message: "Password reset email sent!",
                          });
                        })
                        .catch((error) => {
                          console.log(error);
                          return res.json({
                            status: "FAILED",
                            message: "password reset mail failed",
                          });
                        });
                    }
                  })
                  .catch((err: Error) => {
                    console.log(err);
                    return res.json({
                      status: "FAILED",
                      message:
                        "Error Occured while hashing the password reset data!!",
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                return res.json({
                  status: "FAILED",
                  message: "Clearing existing password reset records failed",
                });
              });
          }
        } else {
          return res.json({
            status: "FAILED",
            message: "No account with the supplied email exists!!",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    return res.json({ status: 500, msg: error });
  }
};

export { ForgotPassword, ResetPassword };
