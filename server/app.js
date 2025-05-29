import express from 'express'
import sequelize from "./db.js"
import User from './models/User.js'

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
