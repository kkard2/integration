import { Router } from "express"
import auth from "../middleware/auth.js"
import {getEmploymentData} from "../controllers/employmentController.js";

const router = Router()

router.get("/employment", auth, getEmploymentData)

export default router
