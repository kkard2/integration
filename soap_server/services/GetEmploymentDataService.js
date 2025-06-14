import { Op } from "sequelize"
import Employment from "../models/Models.js"

const GetEmploymentData = async (args) => {
    const { countryCode, startYear, endYear } = args

    const records = await Employment.findAll({
        attributes: ['year', 'ratio'],
        where: {
            countryCode: countryCode,
            year: {
                [Op.gte]: startYear,
                [Op.lte]: endYear
            }
        },
        order: ['year'],
        raw: true
    })

    console.log(records)
    return {
        record: records
    }
}

export default GetEmploymentData
