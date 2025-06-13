import { Router } from "express"
import auth from "../middleware/auth.js"
import {saveSummary, getUserSummaries} from "../controllers/summaryController.js";

const router = Router()


router.post("/save", auth, saveSummary)
router.get("/saved", auth, getUserSummaries)

export default router
