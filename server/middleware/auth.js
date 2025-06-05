import { verify } from "jsonwebtoken"
import { findById } from "../models/User"

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Dostęp zabroniony. Brak tokenu.",
            })
        }

        const token = authHeader.substring("Bearer ".length)
        const decoded = verify(token, process.env.JWT_KEY)
        const user = await findById(decoded._id)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token wygasł",
            })
        }

        req.user = decoded
        next()
    } catch (error) {
        console.error("Auth middleware error:", error)

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Nieprawidłowy token",
            })
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token wygasł",
            })
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

export default auth
