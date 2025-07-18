import { Sequelize } from "sequelize"
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD, {
        host: process.env.DATABASE_URL,
        dialect: 'mysql'
    }
)

export default sequelize
