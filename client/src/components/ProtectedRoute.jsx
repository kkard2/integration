import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ element }) {
    const { user } = useAuth();
    return user ? element : <Navigate to="/" />;
    
}
