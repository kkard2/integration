/*
IN:
    -> COUNTRY
    -> YEAR_BEGIN
    -> YEAR_END

OUT:
    <- VALUE
*/

import sequelize from "../db.js"
import { Country } from "../models/Models.js"

const ONE_HOUR = 60 * 60 * 1000
let lastUpdated = new Date(0)

export const getTotalConsumption = async (req, res) => {
    const apiUrl = "https://ghoapi.azureedge.net/api/SA_0000001400"
    const Dim1 = "ALCOHOLTYPE_SA_TOTAL"
    const { country, yearBegin, yearEnd } = req.query
    const filter = `SpatialDim eq '${country}' and TimeDim gt ${yearBegin} and TimeDim lt ${yearEnd} and Dim1 eq '${Dim1}'`

    try {
        const requestUrl = `${apiUrl}?$filter=${filter}`
        const response = await fetch(requestUrl)

        if (!response.ok) {
            console.error(`URL: "${requestUrl}"`)
            console.error((await response.json()).error.message)
            return res.status(response.status).json({ message: "REST API fetching data error" })
        }

        const data = (await response.json()).value
        .sort((x, y) => x.TimeDim - y.TimeDim)
        .map(entry => ({
            year: entry.TimeDim,
            value: entry.NumericValue
        }))

        if (data.length === 0) {
            return res.status(404).json({message: "Not found"})
        }

        res.json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getCountries = async (_, res) => {
    if (Date.now() - lastUpdated.getTime() > ONE_HOUR) {
        const apiUrl = "https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues"

        try {
            const response = await fetch(apiUrl)
            const data = await response.json()

            if (!response.ok) {
                console.error("Fetching country error response: " + response)
                return res.status(response.status).json({ message: "REST API countries fetching data error" })
            }

            const countries = data.value.map(country => ({
                code: country.Code,
                name: country.Title
            }))

            console.log(countries)

            const t = await sequelize.transaction()

            try {
                await Country.destroy({ where: {} })
                await Country.bulkCreate(countries, { transaction: t})
                await t.commit()
            } catch (err) {
                console.error(err)
                return res.status(500).json({ message: "Loading countries to database unsuccessful" })
            }
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Fetching list of countries unsuccessful" })
        }
    }

    const countries = await Country.findAll()
    const filteredCountries = countries.map(country => ({
        code: country.code,
        name: country.name
    }))
    res.json(filteredCountries)
}
