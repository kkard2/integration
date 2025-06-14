import sequelize from "../db.js"
import { Summary } from "../models/Models.js"

export const saveSummary = async (req, res) => {
    const {startYear, endYear, country} = req.body
    const userId = req.user.id

    console.log("Otrzymane dane: ", req.body)

    if(!startYear || !endYear || !country) {
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

    const existingSummary = await Summary.findAll({
        where: {
            UserId: userId,
            countryCode: country,
            startYear: startYear,
            endYear: endYear,
        }
    })

    if(existingSummary.length > 0) {
        return res.status(409).json({
            success: false,
            message: "Użytkownik zapisał już takie summary"
        })
    }

    const t = await sequelize.transaction()
    try {
        const summary = await Summary.create(
            {
                countryCode: country,
                startYear: startYear,
                endYear: endYear,
                UserId: userId,
            },
            {transaction: t}
        )
        await t.commit()

        console.log("Summary saved: ", summary)

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

export const getUserSummaries = async (req, res) => {
    const userId = req.user.id

    try {
        const summaries = await Summary.findAll({
            where: {
                UserId: userId
            }
        })

        console.log("Summaries: ", summaries)
        if(!summaries) {
            return res.status(404).json({
                success: false,
                message: "Brak summary dla użytkownika"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Summaries pobrane pomyślnie",
            data: {
                summaries
            }
        })
    } catch (error) {
        console.log("Error fetching user summaries: ", error)
    }
}

export const deleteSummary = async (req, res) => {
    const {id} = req.params
    const userId = req.user.id

    const summary = await Summary.findByPk(id)
    if(!summary) {
        return res.status(404).json({
            success: false,
            message: "Summary nie istnieje"
        })
    }

    if(summary.UserId !== userId) {
        return res.status(401).json({
            success: false,
            message: "Dostep zabroniony"
        })
    }

    const t = await sequelize.transaction()
    try {
        await summary.destroy({transaction: t})
        await t.commit()
    } catch (error) {
        await t.rollback()
        console.log("Summary error: ", error)
        return res.status(418).json({
            success: false,
            message: "Usuwanie summary zakończone niepowodzeniem"
        })
    }
}