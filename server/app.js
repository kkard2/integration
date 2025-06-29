import express from 'express'
import cors from 'cors'
import sequelize from "./db.js"
import { User, Role, Summary, Comment, Country } from './models/Models.js' // you must import models before sync
import authRoutes from "./routes/auth.js"
import dataRoutes from "./routes/alcohol.js"
import summaryRoutes from "./routes/summary.js"
import employmentRoutes from "./routes/employment.js"

const PORT = 3000
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/data", employmentRoutes)

try {
    await sequelize.sync()
    console.log('Database successfully synced')

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`)
    })
} catch (error) {
    console.error('Sync failed: ', error)
}
