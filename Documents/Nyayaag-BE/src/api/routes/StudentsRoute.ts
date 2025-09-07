import {Router} from "express";
// import { UpdateProfile , updatePersonalDetails , updateAdvocateBarDetails } from "../controllers/advocate/UpdateProfile"
import {  UpdateDetails } from "../controllers/student/UpdateProfile";

const router = Router();


router.post("/update",UpdateDetails)

// router.put("/updatePersonalDetails", updatePersonalDetails )

// router.put("/updateAdvocateBarDetails", updateAdvocateBarDetails )

export default router;
