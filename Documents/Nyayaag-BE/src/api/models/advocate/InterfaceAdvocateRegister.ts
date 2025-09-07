import { ObjectId } from 'mongodb';
// ! Interface for the advocate Model

import { Document } from "mongoose";

export default interface IAdvocate extends Document {
  user: ObjectId;
  personalDetails: PersonalDetails;
  advocateBarDetails: AdvocateBarDetails;
  clientDetails: [
    {
      courtComplex: string;
      caseType: string;
      caseNumber: string;
      caseYear: number;
      clientName: string;
      contactNumber: number;
      address: string;
      IAdetails: string;
      nextHearingDate: Date;
    }
  ];
}

interface PersonalDetails {
  salutation?: string;
  firstName: string;
  middleName: string| null;
  lastName: string| null;
  gender: string;
  emailAddress: string;
  DOB: Date;
  phoneNo: number;
}

interface AdvocateBarDetails {
  state?: string;
  district: string;
  barCouncilNumber: number;
  areaOfPractice: string;
  specialization: string;
  officeAddress:string;
  pinCode: number;
}

interface ClientDetails{
  courtComplex: string;
  caseType: string;
  caseNumber: string;
  caseYear: number;
  clientName: string;
  contactNumber: number;
  address: string;
  IAdetails: string;
  nextHearingDate: Date;
}

export {PersonalDetails , AdvocateBarDetails,ClientDetails}
