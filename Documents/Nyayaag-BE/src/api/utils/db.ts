import mongoose from "mongoose";
// console.log()
const url:string = process.env.MONGODB_URI?process.env.MONGODB_URI:""

mongoose.set("debug", true); // To see mongoose data in the terminal Mongoose : ***
mongoose.Promise.Promise; // To use async functions

export default () => {
    mongoose
        .connect(url)
        .then(() => {
            console.log("Connected to the data base !");
        })
        .catch((err) => {
            console.log(`ERROR!!! : ${err}`);
        })
}

const connection = mongoose.connection;
export { connection };
