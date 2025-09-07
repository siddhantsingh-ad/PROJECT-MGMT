import {Router} from "express";
import { AddClient } from "../controllers/advocate/AddClient";
import {  updatePersonalDetails , updateAdvocateBarDetails , getDetails } from "../controllers/advocate/UpdateProfile"
import {CaseReminder , ViewClients} from "../controllers/advocate/CaseReminder"

const router = Router();

router.post("/updatePersonalDetails", updatePersonalDetails )

router.post("/updateAdvocateBarDetails", updateAdvocateBarDetails )

router.post("/addclient",AddClient)

router.post("/caseReminder",CaseReminder)

router.post("/profile",getDetails)

router.post("/viewClients",ViewClients)
export default router;
