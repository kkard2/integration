import { DataTypes } from "sequelize"
import sequelize from "../db.js"

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default User
