import sequelize from "../db.js"
import soap from 'soap'

const SOAP_URL=`${process.env.SOAP_URL}/wsdl?wsdl`

export const getEmploymentData = async (req, res) => {
    const { country, yearBegin, yearEnd } = req.query
    const userId = req.user.id

    let countryCode = country
    let startYear = yearBegin
    let endYear = yearEnd

    if(!country || !yearBegin || !yearEnd) {
        return res.status(400).json({
            error: 'Pola nie mogą być puste'
        })
    }

    if(!userId) {
        return res.status(401).json({
            success: false,
            message: "Dostep zabroniony"
        })
    }

    try{
        const client = await soap.createClientAsync(SOAP_URL)
        const [result] = await client.GetEmploymentDataAsync({
            countryCode,
            startYear,
            endYear,
        })

        let records = result?.record || []

        if (!Array.isArray(records)) {
            records = [records]
        }

        const sanitized = records.map(r => ({
            year: r.year,
            ratio: typeof r.ratio === 'object' ? null : r.ratio
        }))

        console.log(sanitized)

        res.status(200).json({
            sanitized
        })
    } catch (error) {
        console.error("SOAP call failed:", error)
        res.status(500).json({ error: 'Failed to fetch data from SOAP service' })
    }
}
