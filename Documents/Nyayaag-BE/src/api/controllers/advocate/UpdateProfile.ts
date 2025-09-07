import { Handler } from "express";
import Auth from "../../models/auth/authModel";
import Advocate from "../../models/advocate/advocate";
import IAdvocate from "../../models/advocate/InterfaceAdvocateRegister";
import IAuth from "../../models/auth/InterfaceAuth";
import mongoose from "mongoose";

const updatePersonalDetails: Handler = async (req, res) => {
  console.log(req.body);
  try {
    const idString = req.body.userID.slice(1,req.body.userID.length-1);
    console.log(idString);
    const id = new mongoose.Types.ObjectId(idString)
    console.log(id)
    const user: IAuth = await Auth.findOne({ _id: id || null }).lean();
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "The requested User doesn't exists!!",
      });
    } else {
      if (!user.verified) {
        return res.status(404).json({
          status: "FAILED",
          message: "Please Verify your username to login!!",
        });
      }
      if (user.userType !== "advocate") {
        return res.status(404).json({
          status: "FAILED",
          message: "This user type isn't allowed to login!!",
        });
      }
    }
    const {
      salutation,
      firstName,
      middleName,
      lastName,
      gender,
      emailAddress,
      DOB,
      phoneNo,
    } = req.body;
    const data = {
      salutation: salutation,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      gender: gender,
      emailAddress: emailAddress,
      DOB: DOB,
      phoneNo: phoneNo,
    };
    console.log(user);
    const advocate: IAdvocate = await Advocate.findOne({
      user: user._id,
    }).lean();
    if (!advocate) {
      const newAdvocate = {
        user: user._id,
        personalDetails: {
          salutation: salutation,
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          gender: gender,
          emailAddress: emailAddress,
          DOB: DOB,
          phoneNo: phoneNo,
        },
        advocateBarDetails: {
        },
        clientDetails: [],
      };
      const result = await Advocate.create(newAdvocate);
      console.log(result);
    } else {
      await Advocate.updateOne(
        { user: user._id },
        { $set: { personalDetails: data } }
      );
    }
    return res.status(200).json({
      status: "SUCCESSFUL",
      message: "This user has been updated!!",
    });
  } catch {
    return res.status(400).jsonp({message : "Not working"});
  }
};

const updateAdvocateBarDetails: Handler = async (req, res) => {
  try {
    const idString = req.body.userID.slice(1,req.body.userID.length-1);
    console.log(idString);
    const id = new mongoose.Types.ObjectId(idString)
    console.log(id)
    const user: IAuth = await Auth.findOne({ _id: id || null }).lean();
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "The requested User doesn't exists!!",
      });
    } else {
      if (!user.verified) {
        return res.status(404).json({
          status: "FAILED",
          message: "Please Verify your username to login!!",
        });
      }
      if (user.userType !== "advocate") {
        return res.status(404).json({
          status: "FAILED",
          message: "This user type isn't allowed to login!!",
        });
      }
    }
    const {
      state,
      district,
      barCouncilNumber,
      areaOfPractice,
      specialization,
      officeAddress,
      pinCode,
    } = req.body;
    const data = {
      state: state,
      district: district,
      barCouncilNumber: barCouncilNumber,
      areaOfPractice: areaOfPractice,
      specialization: specialization,
      officeAddress: officeAddress,
      pinCode: pinCode,
    };
    const advocate: IAdvocate = await Advocate.findOne({
      user: user._id,
    }).lean();
    if (!advocate) {
      const newAdvocate = {
        user: user._id,
        personalDetails: {
        },
        advocateBarDetails: {
          state: state,
          district: district,
          barCouncilNumber: barCouncilNumber,
          areaOfPractice: areaOfPractice,
          specialization: specialization,
          officeAddress: officeAddress,
          pinCode: pinCode,
        },
        clientDetails: [],
      };
      const result = await Advocate.create(newAdvocate);
      console.log(result);
    } else {
      await Advocate.updateOne(
        { user: user._id },
        { $set: { advocateBarDetails: data } }
      );
    }
    return res.status(200).json({
      status: "SUCCESSFUL",
      message: "This user has been updated!!",
    });
  } catch {
    return res.send("Not working");
  }
};

const getDetails: Handler = async (req, res) => {
  try {
    const idString = req.body.userID.slice(1,req.body.userID.length-1);
    console.log(idString);
    const id = new mongoose.Types.ObjectId(idString)
    console.log(id)
    const user: IAuth = await Auth.findOne({ _id: id || null }).lean();
    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "The requested User doesn't exists!!",
      });
    } else {
      if (!user.verified) {
        return res.status(404).json({
          status: "FAILED",
          message: "Please Verify your username to login!!",
        });
      }
      if (user.userType !== "advocate") {
        return res.status(404).json({
          status: "FAILED",
          message: "This user type isn't allowed to login!!",
        });
      }
    }
    const advocate = await Advocate.findOne({
      user: user._id,
    });
    if (!advocate) {
      return res.status(400).jsonp({ message: "Please fill your Personal and Bar details", data: {} });
    } else if (advocate.personalDetails.firstName === undefined) {
      if (advocate.advocateBarDetails.state === undefined) {
        return res.status(400).jsonp({ message: "Please fill your Personal details", data: {} });
      } else {
        return res.status(400).jsonp({ message: "Please fill your Personal details", data: { advocateBarDetails: advocate.advocateBarDetails } });
      }
    } else if (advocate.advocateBarDetails.state === undefined) {
      if (advocate.personalDetails.firstName === undefined) {
        return res.status(400).jsonp({ message: "Please fill your Bar details", data: {} });
      } else {
        return res.status(400).jsonp({ message: "Please fill your Bar details", data: { personalDetails: advocate.personalDetails } });
      }
    } else {
      return res
        .status(200)
        .jsonp({
          data: {
            personalDetails: advocate.personalDetails,
            advocateBarDetails: advocate.advocateBarDetails,
          },
        });
    }
  } catch (err) {
    return res.send("Not working");
  }
};
export { updatePersonalDetails, updateAdvocateBarDetails, getDetails };
