import React from 'react'
import Login from './Login'
import Register from './Register'
import { Routes, Route } from 'react-router-dom'
import { useAuthContext } from 'Context/AuthContext'
import { useProfileContext } from 'Context/ProfileContext'
import { useProfileImageContext } from 'Context/ProfileImageContext'
import EmailVerificationPage from './EmailVerificationPage'

export default function Auth() {

    const { setIsAuth, setUser } = useAuthContext()
    const { fetchData: fetchProfileData } = useProfileContext();
    const { fetchData } = useProfileImageContext();

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/verify-email/:token"
                element={
                    <EmailVerificationPage
                        setIsAuth={setIsAuth}
                        setUser={setUser}
                        fetchData={fetchData}
                        fetchProfileData={fetchProfileData}
                    />
                }
            />        </Routes>
    )
}
