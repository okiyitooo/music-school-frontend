import { createContext } from 'react'

export const AuthContext = createContext({
    auth: { isAuthenticated: false, user: null, token: null},
    setAuth: () => {},
    logout: () => {}
})