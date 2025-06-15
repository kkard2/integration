import React, {useState} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Navbar from "./Navbar.jsx";
import '../App.css'

export default function ImportJson() {
    const [fileData, setFileData] = useState(null);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            setError('Nieprawidłowy format pliku. Wymagany format: .json');
            return;
        }

        setError('');
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);

                if (!data || !Array.isArray(data.data)) {
                    setError('Niepoprawna struktura danych w pliku.');
                } else {
                    setFileData(data);
                    setChartData(data.data);
                }
            } catch (err) {
                setError('Błąd podczas wczytywania danych z pliku.');
                console.error(err);
            }
        };

        reader.readAsText(file);
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2>Wczytaj dane z pliku JSON</h2>

                <div className="format-info">
                    <p>
                        Wymagany format pliku JSON:
                        <br />
                        &#123;
                        &nbsp;
                        <span className="key">"country"</span>: <span className="value">"POL"</span>, &nbsp;
                        <span className="key">"data"</span>:
                        <br />
                        [&nbsp;&#123;
                        <span className="key">"year"</span>: <span className="value">2001</span>,
                        &nbsp;
                        <span className="key">"value"</span>: <span className="value">8.05278</span>,
                        &nbsp;
                        <span className="key">"ratio"</span>: <span className="value">46.062</span>
                        &#125;,
                        ...
                        ]
                        &nbsp;
                        &#125;
                    </p>
                </div>


                <input type="file" accept=".json" onChange={handleFileUpload}/>

                {error && <div style={{color: 'red'}}>{error}</div>}

                {fileData && !error && (
                    <div>
                        <h3>Dane dla kraju: {fileData.country}</h3>
                        <div className="chart-wrapper">
                            <LineChart
                                width={700}
                                height={350}
                                data={chartData}
                                margin={{top: 5, right: 20, bottom: 25, left: 25}}
                            >
                                <CartesianGrid stroke="#ccc"/>
                                <XAxis dataKey="year" label={{value: 'Rok', position: 'bottom', offset: 0}}/>
                                <YAxis label={{value: '', angle: -90, dx: -20}}/>
                                <Tooltip/>
                                <Legend verticalAlign="top" height={36}/>
                                <Line type="monotone" dataKey="value" name="Spożyty alkohol (per capita) w L" stroke="#2a6df4" strokeWidth={2} dot={{r: 3}}/>
                                <Line type="monotone" dataKey="ratio" name="Procent zatrudnienia" stroke="#f47c2a" strokeWidth={2} dot={{r: 3}}/>
                            </LineChart>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}