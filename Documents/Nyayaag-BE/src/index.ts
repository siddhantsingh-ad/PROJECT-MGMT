import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import database from "./api/utils/db";
import { ObjectId } from "mongodb";
import morgan from "morgan";

// dotenv.config({ path: __dirname + "/.env" });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const session=require("express-session");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MongoDBStore = require('connect-mongodb-session')(session);
// import { Request } from "express";

const app = express();
app.use(cors());
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(express.json({ strict: false }));

app.use(morgan("dev"));

declare module 'express-session' {
  export interface Session {
    user: ObjectId;
  }
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    store: new MongoDBStore({
      uri:process.env.MONGODB_URI,
      collection:process.env.COLLECTION_NAME,
    }),
    cookie: { maxAge: 1000 * 60 * 60 },
    resave: false,
  })
);
// app.use(methodOverride("_method"));
database();
import AdvocateRoute from "./api/routes/AdvocateRoute"
import AuthRoute from "./api/routes/AuthRoute"
import ClientRoute from "./api/routes/UserRoute"
import StudentRoute from "./api/routes/StudentsRoute"

// import { ObjectId } from "mongodb";
app.use("/auth", AuthRoute);
app.use("/advocate",AdvocateRoute)
app.use("/client",ClientRoute)
app.use("/student",StudentRoute)



app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
