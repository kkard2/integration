import express from 'express'
import cors from 'cors'
import sequelize from "./db.js"
import { User, Role, Summary, Comment } from './models/Models.js' // you must import models before sync
import authRoutes from "./routes/auth.js"

const PORT = 3000
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

try {
    await sequelize.sync()
    console.log('Database successfully synced')

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`)
    })
} catch (error) {
    console.error('Sync failed: ', error)
}
