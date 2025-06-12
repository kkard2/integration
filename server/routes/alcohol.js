import { Router } from "express"
import { getCountries, getTotalConsumption } from "../controllers/alcoholController.js"
import auth from "../middleware/auth.js"

const router = Router()


router.get("/consumption", auth, getTotalConsumption)
router.get("/countries", auth, getCountries)

export default router
