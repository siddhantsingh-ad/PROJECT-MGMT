import mongoose,{ Schema , model , Model } from "mongoose";
import IStudent from "./InterfaceStudent";

const StudentSchema: Schema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "auth_user",
    },
    studentName : {
        type : String,
    },
    nameOfCollege : {
        type : String,
    },
    RollNo : {
        type : Number,
    },
    Course : {
        type : String,
    },
    CourseDuration : {
        type : Number,
    },
    address : {
        type : String,
    },
    pincode : {
        type : Number,
    }
})

const Student: Model<IStudent> = model<IStudent>("Student", StudentSchema);

export default Student;