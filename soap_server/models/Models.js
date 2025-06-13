import { DataTypes } from "sequelize"
import sequelize from "../db.js"

const Employment = sequelize.define('Employment', {
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ratio: {
        type: DataTypes.FLOAT
    }
})

export default Employment
