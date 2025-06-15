import Navbar from "./Navbar.jsx";
import {useAuth} from "../AuthContext.jsx";
import {useEffect, useState} from "react";
import {DEFAULT_URL} from "../constants.js";
import {Trash2} from 'lucide-react'
import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts';

export default function Saved() {
    const auth = useAuth();
    const [savedSummaries, setSavedSummaries] = useState([]);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [chartData, setChartData] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchSavedSummaries = async () => {
            try {
                const response = await fetch(`${DEFAULT_URL}/api/summary/saved`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${auth.user.token}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setError("");
                    setSavedSummaries(data.data.summaries);
                }
            } catch (error) {
                console.log(error);
                setError("Błąd pobierania zapisanych summary");
            }
        };

        fetchSavedSummaries();
    }, []);

    const fetchChartData = async (summary) => {
        const country = summary.countryCode;
        const yearBegin = summary.startYear;
        const yearEnd = summary.endYear;

        try {
            const query = new URLSearchParams({
                country,
                yearBegin,
                yearEnd
            }).toString();

            const alcoholResponse = await fetch(`${DEFAULT_URL}/api/data/consumption?${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                },
            });

            const alcoholJson = await alcoholResponse.json();
            if (!alcoholResponse.ok) throw new Error("Błąd danych alkoholu");

            const alcoholData = alcoholJson;

            const employmentResponse = await fetch(`${DEFAULT_URL}/api/data/employment?${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                }
            });

            if (!employmentResponse.ok) throw new Error("Błąd danych SOAP");

            const employmentJson = await employmentResponse.json()
            const employmentData = employmentJson.sanitized

            const merged = alcoholData.map(a => {
                const match = employmentData.find(e => e.year === a.year);
                return {
                    year: a.year,
                    value: a.value,
                    ratio: match ? match.ratio : null
                };
            });

            setChartData(prevData => ({
                ...prevData,
                [summary.id]: merged
            }));
        } catch (error) {
            console.error("fetchChartData error:", error);
            setError("Błąd podczas pobierania danych do wykresu");
        }
    };


    const handleSummaryClick = async (summary) => {
        const newExpandedId = expandedId === summary.id ? null : summary.id;
        setExpandedId(newExpandedId);

        if (newExpandedId && !chartData[summary.id]) {
            await fetchChartData(summary);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${DEFAULT_URL}/api/summary/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                }
            });

            const data = await response.json();

            console.log(data)

            if (data.success) {
                setSavedSummaries(prevSummaries => prevSummaries.filter(summary => summary.id !== id));
                setMessage("Pomyślnie usunięto");
            } else {
                setError(data.message || "Błąd podczas usuwania");
            }
        } catch (error) {
            console.error("Delete error: ", error);
            setError("Błąd podczas usuwania");
        }

        setTimeout(() => {
            setMessage("");
        }, 3000);
    };


    return (
        <div>
            <Navbar/>
            <div className="container">
                <h3>Zapisane zestawienia:</h3>
                {error && <div className="error">{error}</div>}
                {savedSummaries.length > 0 && (savedSummaries.map((s) => (
                    <div key={s.id} className="saved-summary">
                        <div
                            className="saved-summary-header"
                            onClick={() => handleSummaryClick(s)}
                            style={{cursor: 'pointer'}}
                        >
                            <div className="saved-summary-country">{s.countryCode}</div>
                            <div>
                                <div className="saved-summary-years">{s.startYear} - {s.endYear}</div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(s.id)}
                                    }
                                    className="delete-button"
                                    title="Usuń"
                                >
                                    <Trash2 size={14}/>
                                </button>
                            </div>
                        </div>
                        {expandedId === s.id && chartData[s.id] && (
                            <div className="chart-wrapper">
                                <LineChart width={700} height={350} data={chartData[s.id]}
                                           margin={{top: 5, right: 20, bottom: 25, left: 25}}>
                                    <CartesianGrid stroke="#ccc"/>
                                    <XAxis dataKey="year" label={{ value: 'Rok', position: 'bottom', offset: 0 }}/>
                                    <YAxis label={{ value: '', angle: -90, dx: -20 }}/>
                                    <Tooltip/>
                                    <Legend verticalAlign="top" height={36}/>
                                    <Line type="monotone" dataKey="value" name="Spożyty alkohol (per capita) w L" stroke="#2a6df4" strokeWidth={2} dot={{ r: 3 }}/>
                                    <Line type="monotone" dataKey="ratio" name="Procent zatrudnienia" stroke="#f47c2a" strokeWidth={2} dot={{ r: 3 }}/>
                                </LineChart>
                            </div>
                        )}
                    </div>
                )))}
                {message && <div className="message">{message}</div>}
            </div>
        </div>
    );
}
