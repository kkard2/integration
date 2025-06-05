import { DataTypes } from "sequelize"
import jwt from "jsonwebtoken"
import sequelize from "../db.js"

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY,
        { expiresIn: "7d" })
    return token
}


export default User
