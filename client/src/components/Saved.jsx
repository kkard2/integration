import Navbar from "./Navbar.jsx";
import {useAuth} from "../AuthContext.jsx";
import {useEffect, useState} from "react";
import {DEFAULT_URL} from "../constants.js";
import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from 'recharts';

export default function Saved() {
    const auth = useAuth();
    const [savedSummaries, setSavedSummaries] = useState([]);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [chartData, setChartData] = useState({});

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

    return (
        <div>
            <Navbar/>
            <div className="container">
                <h3>Zapisane summary:</h3>
                {error && <div className="error">{error}</div>}
                {savedSummaries.length > 0 && (savedSummaries.map((s) => (
                    <div key={s.id} className="saved-summary">
                        <div 
                            className="saved-summary-header" 
                            onClick={() => handleSummaryClick(s)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="saved-summary-country">{s.countryCode}</div>
                            <div className="saved-summary-years">{s.startYear} - {s.endYear}</div>
                        </div>
                        {expandedId === s.id && chartData[s.id] && (
                            <div className="chart-wrapper">
                                <LineChart width={700} height={350} data={chartData[s.id]}>
                                    <CartesianGrid stroke="#ccc"/>
                                    <XAxis dataKey="year"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#000000"
                                        strokeWidth={2} 
                                        dot={{r: 3}}
                                    />
                                </LineChart>
                            </div>
                        )}
                    </div>
                )))}
            </div>
        </div>
    );
}