import express from 'express'
import sequelize from './db.js'
import Employment from './models/Models.js'
import importEmploymentData from './utils/xmlImporter.js'

const PORT = 3001
const app = express()

try {
    await sequelize.sync()
    console.log("Database successfully synced")

    await importEmploymentData()
    console.log("Employment data successfully imported")

    app.listen(PORT, () => {
        console.log("Server listening on port " + PORT)
    })
} catch (err) {
    console.error("Sync failed: ", err)
}
