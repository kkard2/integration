import { Router } from "express"
import auth from "../middleware/auth.js"
import {saveSummary, getUserSummaries, deleteSummary} from "../controllers/summaryController.js";

const router = Router()


router.post("/save", auth, saveSummary)
router.get("/saved", auth, getUserSummaries)
router.delete("/delete/:id", auth, deleteSummary)

export default router
