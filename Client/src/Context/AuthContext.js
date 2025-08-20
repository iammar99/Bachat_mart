import React, { useEffect, useState, useContext, createContext } from 'react'

const AuthContext = createContext()

export default function AuthContextProvider({ children }) {

    // Auth Tracker
    const [isAuth, setIsAuth] = useState(false)

    // User Tracker
    const [user, setUser] = useState({})

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token == "true") {
            setIsAuth(true)
            setUser(JSON.parse(localStorage.getItem("user")))
        } else {
            setIsAuth(false)
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)
