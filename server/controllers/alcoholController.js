/*
IN:
    -> COUNTRY
    -> YEAR_BEGIN
    -> YEAR_END

OUT:
    <- VALUE
*/

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
