import mongoose, { Schema, model, Model } from "mongoose";
import IClient from "./InterfaceClientRegister";

const ClientSchema: Schema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "auth_user",
  },
  personalDetails: {
    type: Object,
  },
});

const Client: Model<IClient> = model<IClient>("Client", ClientSchema);

export default Client;