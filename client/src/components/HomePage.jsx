
import { useContext, useEffect, useState } from 'react'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_URL } from '../constants'
import { useAuth } from '../AuthContext';

export default function HomePage() {
    const auth = useAuth();
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState("")
    const [startYear, setStartYear] = useState(0)
    const [endYear, setEndYear] = useState(0)
    const [errors, setErrors] = useState("")

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async ()=> {
            try {
                const response = await fetch(`${DEFAULT_URL}/api/countries`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.user.token}`
                    }
                })
                const data = await response.json()
                if(response.ok) {
                    setCountries(data.data.countries)
                } else {
                    setErrors(data.message || "Unknown error")
                }
            } catch (error) {
                // console.log(error)
                setErrors("Fetch countries error: ", error)
            }
        }
        fetchCountries()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${DEFAULT_URL}/api/countries`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.user.token}`
                },
                body: JSON.stringify({
                    country: country,
                    startYear: startYear,
                    endYear: endYear
                })
            })
            const data = await response.json()
            if(response.ok) {
                //TODO
            } else {
                setErrors("Fetch data error: ")
            }
        } catch (error) {
            console.log("Submit error: ", error)
        }
    }

    return (
        <div>
            <button onClick={auth.logout}>Logout</button>
            <form onSubmit={handleSubmit}>
                <label htmlFor='country'>Kraj:</label><br />
                <select id='country' onChange={(e) => setCountry(e.target.value)}>
                    {countries.map( (c) => {
                        <option value={c.code}>{c.name}</option>
                    })}
                </select>
                <p>Zakres dat:</p>
                <label htmlFor='startYear'>Start year:</label>
                <input type='number' id='startYear' className='form-group' onChange={(e) => setStartYear(e.target.value)}></input><br />
                <label htmlFor='endYear'>End year:</label>
                <input type='number' id='endYear' className='form-group' onChange={(e) => setEndYear(e.target.value)}></input>
                <input type="submit" value="Wyślij" className='submit-button'/>
            </form>
            <div className='error'>{errors}</div>
        </div>
    )
}
