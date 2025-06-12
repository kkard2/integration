import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import {DEFAULT_URL} from '../constants'

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("")
    const navigate = useNavigate();
    async function submit(e) {
        e.preventDefault();
        const response = await fetch(`${DEFAULT_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        if(response.ok) {
            const data = await response.json()
            localStorage.setItem("token", data.token)
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
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </>
    )
}
