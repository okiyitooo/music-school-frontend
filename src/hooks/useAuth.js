import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const { setAuth } = useContext(AuthContext);
    const setStoredAuth = (auth) => {
        if (auth) {
            localStorage.setItem('auth', JSON.stringify(auth))
        } else {
            localStorage.removeItem('auth')
        }
    }
    const clearAuth = () => {
        setAuth({ isAuthenticated: false, user:null, token:null })
        setStoredAuth(null)
    }
    return {setStoredAuth, clearAuth};
}