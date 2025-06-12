import { Router } from "express"
import { getTotalConsumption } from "../controllers/alcoholController.js"
import auth from "../middleware/auth.js"

const router = Router()


router.get("/", auth, getTotalConsumption)

export default router
