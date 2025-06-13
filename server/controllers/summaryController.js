import sequelize from "../db.js"
import { Summary } from "../models/Models.js"

export const saveSummary = async (req, res) => {
    const {beginYear, endYear, country} = req.body
    const userId = req.user.id

    if(!beginYear || !endYear || !country) {
        return res.status(400).json({
            success: false,
            message: "Dane nie mogą być puste"
        })
    }

    if(!userId) {
        return res.status(401).json({
            success: false,
            message: "Dostep zabroniony"
        })
    }

    const t = await sequelize.transaction()
    try {
        const summary = await Summary.create(
            {
                contryCode: country,
                startYear: startYear,
                endYear: endYear
            },
            {transaction: t}
        )
        await t.commit()

        return res.status(200).json({
            success: true,
            message: "Zapisano summary"
        })
    } catch (error) {
        await t.rollback()
        console.log("Summary error: ", error)
        return res.status(418).json({
            success: false,
            message: "Zapisanie summary zakończone niepowodzeniem"
        })
    }
}
