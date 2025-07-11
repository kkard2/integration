import soap from 'soap'
import http from 'http'
import fs from 'fs/promises'
import cors from 'cors'
import sequelize from './db.js'
import Employment from './models/Models.js'
import GetEmploymentData from './services/GetEmploymentDataService.js'

import importEmploymentData from './utils/xmlImporter.js'

const PORT = 8000
let wsdlXml

try {
    wsdlXml  = await fs.readFile('./wsdl/service.wsdl', 'utf8')

    await sequelize.sync()
    console.log("Database successfully synced")

    await importEmploymentData()
    console.log("Employment data successfully imported")
} catch (err) {
    console.error("Sync failed: ", err)
    process.exit(1)
}

const SoapService = {
    EmploymentDataService: {
        EmploymentDataPort: {
            GetEmploymentData: GetEmploymentData
        }
    }
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    res.statusCode = 404
    res.end()
})

soap.listen(server, "/wsdl", SoapService, wsdlXml)

server.listen(PORT, () => {
    console.log(`SOAP server listening on http://localhost:${PORT}/wsdl`)
})
