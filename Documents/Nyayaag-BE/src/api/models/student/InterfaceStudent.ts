// ! Interface for the Student Model

import { Document } from "mongoose";

export default interface IStudent extends Document {
  studentName :  string,
  nameOfCollege : string,
  RollNo : string,
  Course : string,
  CourseDuration : number ,
  address : string,
  pincode : number
}

