import { Router } from "express"
import { getTotalConsumption } from "../controllers/alcoholController.js"

const router = Router()

router.get("/", getTotalConsumption)

export default router
