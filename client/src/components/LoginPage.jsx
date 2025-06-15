import { useContext, useState } from 'react'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("")
    const navigate = useNavigate();
    const auth = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    async function submit(e) {
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/auth/login`, {
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
            const data = await response.json()
            localStorage.setItem("token", data.data.token)
            auth.login({ token: data.data.token })
            navigate('/home')
        } else {
            try {
                const data = await response.json()
                setErrors(data.message)
            } catch {
                console.log("Login error")
            }
        }
    }

    return (
        <>
            <h1>Login</h1>
            <div className="card">
                <div className='error'>{errors}</div>
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
                    <button type="submit" className="submit-button">Submit</button>
                    <Link to="/register">Załóż konto</Link>
                </form>
            </div>
        </>
    )
}
