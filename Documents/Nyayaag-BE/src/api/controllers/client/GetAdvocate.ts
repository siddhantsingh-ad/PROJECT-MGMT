import { Handler } from "express";
import mongoose from "mongoose";
import Advocate from "../../models/advocate/advocate";
import IAdvocate from "../../models/advocate/InterfaceAdvocateRegister";
import Client from "../../models/client/clientRegister";
import Auth from "../../models/auth/authModel";
import IAuth from "../../models/auth/InterfaceAuth";

const GetAdvocate: Handler = async (req, res) => {
  try {
    const idString = req.body.userID.slice(1, req.body.userID.length - 1);
    console.log(idString);
    const id = new mongoose.Types.ObjectId(idString);
    console.log(id);
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
      if (user.userType !== "client") {
        return res.status(404).json({
          status: "FAILED",
          message: "This user type isn't allowed to login!!",
        });
      }
    }
    const client = await Client.findOne({ user: user._id });
    if(client==null||client.personalDetails==null){
      return res.status(404).json({
        status: "FAILED",
        message: "Update Client details",
      });
    }
    
    const clientPincode=client.personalDetails.pincode;
    //as of now only one court and as well as no clients collection. so code is according to that only
    // all details of advocate going to frontend as of now.
    // change it later
    const courtType = req.body.court;
    const caseType = req.body?.caseType;
    const advocates = await Advocate.find({});
    const requiredAdvocate: (IAdvocate & { _id: any })[] = [];
    advocates.forEach((advocate) => {
      if (
        advocate.advocateBarDetails.areaOfPractice === courtType ||
        advocate.advocateBarDetails.specialization === caseType
      ) {
        requiredAdvocate.push(advocate);
      }
    });
    if(requiredAdvocate.length>0){
       requiredAdvocate.sort((a,b)=>Math.abs(clientPincode-a.advocateBarDetails.pinCode)-Math.abs(clientPincode-b.advocateBarDetails.pinCode))
        return res.status(200).json({data:requiredAdvocate});
    }else{
        return res.status(400).json({message: "No advocates to display to match you result"})
    }
  } catch {
    return res.status(400).json({ message: "Not working" });
  }
};

export { GetAdvocate };
