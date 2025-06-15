import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Saved from './components/Saved';
import ImportJson from "./components/ImportJson.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
                <Route path="/saved" element={<ProtectedRoute element={<Saved />} />} />
                <Route path="/import-json" element={<ProtectedRoute element={<ImportJson />} />} />
            </Routes>
        </Router>
    );
}

export default App;
