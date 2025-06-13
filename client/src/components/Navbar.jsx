import { NavLink } from 'react-router-dom';
import {useAuth} from '../AuthContext';
import '../App.css';

export default function Navbar() {
    const auth = useAuth();

    return (
        <nav className="navbar">
            <NavLink to="/home"><div className="navbar-logo">AlkoStat</div></NavLink>
            <ul className="navbar-links">
                <li><NavLink to="/home" className="nav-link">Home</NavLink></li>
                <li><NavLink to="/saved" className="nav-link">Zapisane</NavLink></li>
            </ul>
            <div>
                <button className="logout-button" onClick={auth.logout}>Logout</button>
            </div>
        </nav>
    );
}
