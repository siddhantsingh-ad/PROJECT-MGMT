import { Handler } from 'express';
import Client from '../../models/client/clientRegister';
import IAuth from '../../models/auth/InterfaceAuth';
import Auth from '../../models/auth/authModel';
import mongoose from 'mongoose';

const UpdateDetails: Handler = async (req, res) => {
    console.log(typeof req.body.userID , req.body.userID , "Manav")
    try {
        if (!req.body.userID) {
            return res.status(404).json({
                status: "FAILED",
                message: "Please Login before entering!!",
            })
        }
        const idString = req.body.userID.slice(1,req.body.userID.length-1);
        console.log(idString);
        const id = new mongoose.Types.ObjectId(idString)
        console.log(id)
        const user: IAuth = await Auth.findOne({ _id: id || null }).lean();
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "The requested User doesn't exists!!",
            })
        } else {
            if (!user.verified) {
                return res.status(404).json({
                    status: "FAILED",
                    message: "Please Verify your username to login!!",
                })
            }
            if (user.userType !== "client") {
                return res.status(404).json({
                    status: "FAILED",
                    message: "This user type isn't allowed to login!!",
                })
            }
        }
        const { 
            name,gender,emailAddress,phoneNo,address,pincode,
         } = req.body;
        console.log(user);
        const client = await Client.findOne({ user: user._id });
        console.log(client)
        if (client === null) {
            const newClient = {
                user: user._id,
                personalDetails: {
                    name:name ,
                    gender: gender,
                    emailAddress:emailAddress ,
                    phoneNo:phoneNo ,
                    address: address,
                    pincode: pincode
                },
            }
            console.log(newClient)
            await Client
                .create(newClient)
                .then(() => {
                    return res.status(200).json({
                        status: "SUCCESSFUL",
                        message: "This user can been updated!!",
                    })
                })
                .catch((err) => {
                    return res.status(400).json({
                        status: "FAILED",
                        message: err
                    })
                });
        } else {
            await Client.updateOne({ user: user._id }, {
                $set: {
                    user: user._id,
                    personalDetails: {
                    name:name ,
                    gender: gender,
                    emailAddress:emailAddress ,
                    phoneNo:phoneNo ,
                    address: address,
                    pincode: pincode
                },
                }
            });
        }
        return res.status(200).json({
            status: "SUCCESSFUL",
            message: "This user has been updated!!",
        })
    } catch {
        return res.send("Not working")
    }
}

export { UpdateDetails }