import { XMLParser } from "fast-xml-parser"
import fs from "node:fs/promises"
import Employment from "../models/Models.js"
import sequelize from "../db.js"

const importEmploymentData = async () => {
    let xmlString

    try {
        xmlString = await fs.readFile('./data/data.xml', { encoding: 'utf8' })
    } catch (err) {
        console.error("Error reading XML file: ", err)
        return
    }

    let data

    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        })

        const xmlObj = parser.parse(xmlString)
        const records = xmlObj?.Root?.data?.record

        if (!records || !Array.isArray(records)) {
            console.error("Unexpected XML file structure")
            return
        }

        data =  records.map((rec) => {
            const fields = rec.field
            const countryField = fields.find(f => f['@_name'] === 'Country or Area')
            const yearField = fields.find(f => f['@_name'] === 'Year')
            const valueField = fields.find(f => f['@_name'] === 'Value')

            return {
                countryCode: countryField?.['@_key'] ?? null,
                countryName: countryField?.['#text'] ?? null,
                year: yearField?.['#text'] ? parseInt(yearField['#text']) : null,
                ratio: valueField?.['#text'] ? parseFloat(valueField['#text']) : null
            }
        })
    } catch (err) {
        console.error("Error parsing XML file: ", err)
        return
    }

    const existingCount = await Employment.count()

    if (existingCount > 0) {
        console.log("Table Employment is not empty, skipping XML import...")
        return
    }

    let t

    try {
        t = await sequelize.transaction()
        await Employment.bulkCreate(data, { transaction: t })
        await t.commit()
    } catch (err) {
        await t.rollback()
        console.error("Failed to import employment data: ", err)
    }
}

export default importEmploymentData
