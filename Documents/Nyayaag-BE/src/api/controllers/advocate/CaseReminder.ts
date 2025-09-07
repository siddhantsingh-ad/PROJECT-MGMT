import { Handler } from "express";
import mongoose from "mongoose";
import Advocate from "../../models/advocate/advocate";
import IAdvocate from "../../models/advocate/InterfaceAdvocateRegister";
import Auth from "../../models/auth/authModel";
import IAuth from "../../models/auth/InterfaceAuth";

const CaseReminder: Handler = async (req, res) => {
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
    const hearingDate: Date = new Date(req.body.date);

    const advocate: IAdvocate = await Advocate.findOne({
      user: user._id,
    }).lean();
    
    const clientDetails = advocate.clientDetails;
    if (!clientDetails) {
      return res
        .status(400)
        .jsonp({ status: 400, message: "No clients found" });
    } else {
      const clients: {
        courtComplex: string;
        caseType: string;
        caseNumber: string;
        caseYear: number;
        clientName: string;
        contactNumber: number;
        address: string;
        IAdetails: string;
        nextHearingDate: Date;
      }[] = [];
      clientDetails.forEach((client) => {
        if (client.nextHearingDate.getTime() >  hearingDate.getTime()) {
          clients.push(client);
          console.log(client)
        }
      });
      clients.sort(
        (a, b) => a.nextHearingDate.getTime() - b.nextHearingDate.getTime()
      );
      return res.status(200).jsonp({
        status: "SUCCESSFUL",
        data: clients,
      });
    }
  } catch {
    return res.send("Not working");
  }
};


const ViewClients: Handler = async (req, res) => {
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
    const advocate: IAdvocate = await Advocate.findOne({
      user: user._id,
    }).lean();

    if(!advocate.clientDetails){
      return res.status(400).send({message: "No clients to be displayed!"})
    } else {
      return res.status(200).send({data: advocate.clientDetails});
    }

  } catch {
    return res.send("Not working");
  }
}

export { CaseReminder ,ViewClients };
