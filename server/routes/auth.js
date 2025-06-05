import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import registerValidator from "../middleware/registerValidator.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", login);

export default router;
