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
    }, [savedSummaries]);

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
            const response = await fetch(`${DEFAULT_URL}/api/data/consumption?${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth.user.token}`
                },
            });
            const data = await response.json();

            if (response.ok) {
                const formattedData = data.map(item => ({
                    year: item.year.toString(),
                    value: parseFloat(item.value)
                }));
                setChartData(prev => ({
                    ...prev,
                    [summary.id]: formattedData
                }));
            } else {
                setError("Błąd pobierania danych do wykresu");
            }
        } catch (error) {
            console.log("Błąd pobierania:", error);
            setError("Błąd podczas pobierania danych");
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
                                    onClick={() => handleDelete(s.id)}
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
                                    <XAxis dataKey="year" label={{
                                        value: 'Rok',
                                        position: 'bottom',
                                        offset: 0
                                    }}/>
                                    <YAxis label={{
                                        value: 'Spożyty alkohol w L (per capita)',
                                        angle: -90,
                                        dx: -20
                                    }}
                                    />
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="value" stroke="#2a6df4" strokeWidth={2}
                                          dot={{r: 3}}/>
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