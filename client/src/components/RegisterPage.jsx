import { useState } from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { DEFAULT_URL } from '../constants';

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Hasła są różne');
            return;
        }

        const response = await fetch(`${DEFAULT_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        if (response.ok) {
            navigate("/");
        } else {
            try {
                JSON.stringify(response.body)
                const data = await response.json();
                setError(data.message || 'Błąd rejestracji');
            } catch {
                setError('Błąd rejestracji');
            }
        }
    }

    return (
        <>
            <h1>Register</h1>
            <div className="card">
                {error && <div className="error">{error}</div>}
                <form onSubmit={submit} className="form">
                    <div className="form-group">
                        <label htmlFor="username">Login</label>
                        <input
                            type="text"
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Potwierdź hasło</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="submit-button">Register</button>
                    <Link to="/">Masz już konto?</Link>
                </form>
            </div>
        </>
    );
}
