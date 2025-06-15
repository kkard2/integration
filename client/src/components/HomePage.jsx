import {useEffect, useState} from 'react'
import '../App.css'
import {useNavigate} from 'react-router-dom';
import {DEFAULT_URL} from '../constants'
import {useAuth} from '../AuthContext';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import Navbar from "./Navbar.jsx";

export default function HomePage() {
    const auth = useAuth();
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState("POL")
    const [yearBegin, setYearBegin] = useState(2000)
    const [yearEnd, setYearEnd] = useState(2020)
    const [errors, setErrors] = useState("")
    const [alcoholData, setAlcoholData] = useState([])
    const [employmentData, setEmploymentData] = useState([])
    const [message, setMessage] = useState("")
    const [mergedData, setMergedData] = useState([])


    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            setErrors("")
            try {
                const response = await fetch(`${DEFAULT_URL}/api/data/countries`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${auth.user.token}`
                    }
                })
                const data = await response.json()
                if (response.ok) {
                    setCountries(data)
                } else {
                    setErrors(data.message || "Unknown error")
                }
            } catch (error) {
                console.log(error)
                setErrors("Fetch countries error")
            }
        }

        fetchCountries()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors("")

        try {
            const query = new URLSearchParams({
                country,
                yearBegin,
                yearEnd
            }).toString();
            const response = await fetch(`${DEFAULT_URL}/api/data/consumption?${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                },
            })
            const data = await response.json()
            if (response.ok) {
                setAlcoholData(data)
            } else {
                setErrors("Fetch data error")
            }
        } catch (error) {
            console.log("Submit error: ", error)
        }

        try {
            const query = new URLSearchParams({
                country,
                yearBegin,
                yearEnd
            }).toString();

            const response = await fetch(`${DEFAULT_URL}/api/data/employment?${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                const error = data
                throw new Error(error.error || 'Błąd podczas pobierania danych')
            } else {
                setEmploymentData(data.result[0].record)
                console.log(data)
            }
        } catch (error) {
            console.log("Submit error: ", error)
            setErrors("Fetch data error")
        }
    }

    const handleButtonClick = async () => {
        try {
            const response = await fetch(`${DEFAULT_URL}/api/summary/save`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth.user.token}`
                    },
                    body: JSON.stringify({
                        startYear: yearBegin,
                        endYear: yearEnd,
                        country: country
                    })
                }
            )
            const data = await response.json()
            if (data.success) {
                setMessage("Zapisano pomyślnie")
            } else {
                setMessage(data.message || "Unknown error")
                // setErrors(data.message)
            }
        } catch (error) {
            setErrors("Save search error")
            console.log("Save search error: ", error)
        }
    }

    useEffect(() => {
        if (alcoholData.length > 0 && employmentData.length > 0) {
            const merged = alcoholData.map(entry => {
                const match = employmentData.find(e => e.year === entry.year);
                return {
                    year: entry.year,
                    value: entry.value,
                    ratio: match ? match.ratio : null,
                };
            });
            setMergedData(merged);
        }
    }, [alcoholData, employmentData]);


    return (
        <div>
            <Navbar/>
            <div className="container">
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor='country'>Kraj:</label>
                    <select id="country" className="form-input" value={country}
                            onChange={(e) => setCountry(e.target.value)}>
                        <option value="" disabled>-- Wybierz kraj --</option>
                        {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor='startYear'>Rok początkowy:</label>
                    <input type='number' id='startYear' className='form-input' value={yearBegin}
                           onChange={(e) => setYearBegin(e.target.value)}/>

                    <label htmlFor='endYear'>Rok końcowy:</label>
                    <input type='number' id='endYear' className='form-input' value={yearEnd}
                           onChange={(e) => setYearEnd(e.target.value)}/>

                    <input type="submit" value="Wyślij" className='submit-button'/>
                </form>

                {errors && <div className='error'>{errors}</div>}

                {alcoholData.length > 0 && !errors && (
                    <div>
                        <h3>Wykres dla {country}</h3>
                        <div className="chart-wrapper">
                            <LineChart width={700} height={350} data={mergedData}
                                       margin={{ top: 5, right: 20, bottom: 25, left: 25 }}>
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="year" label={{ value: 'Rok', position: 'bottom', offset: 0 }} />
                                <YAxis label={{ value: '', angle: -90, dx: -20 }} />
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} />
                                <Line type="monotone" dataKey="value" name="Spożyty alkohol (per capita) w L" stroke="#2a6df4" strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="ratio" name="Procent zatrudnienia" stroke="#f47c2a" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </div>
                    </div>
                )}

                {alcoholData.length > 0 && !errors && (
                    <div>
                        <button onClick={handleButtonClick} className='submit-button'>Zapisz</button>
                        {message && <div className='message'>{message}</div>}
                    </div>
                )}
                {/*<button onClick={fetchSoapData}>SOAP</button>*/}
            </div>
        </div>
    )
}
