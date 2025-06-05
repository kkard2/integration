import express from 'express'
import sequelize from "./db.js"
import { User, Role, Summary, Comment } from './models/Models.js' // you must import models before sync

const PORT = 3000
const app = express()

try {
    await sequelize.sync()
    console.log('Database successfully synced')

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`)
    })
} catch (error) {
    console.error('Sync failed: ', error)
}
