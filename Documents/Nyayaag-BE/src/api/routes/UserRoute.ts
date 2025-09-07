import {Router} from "express";
import { UpdateDetails } from "../controllers/client/updateProflie";
import {GetAdvocate}from "../controllers/client/GetAdvocate"
const router = Router();

router.get('/', (req,res) => {
    res.send("get route for client login")
})

router.post('/update',UpdateDetails);
router.post('/getAdvocate',GetAdvocate);

export default router;
